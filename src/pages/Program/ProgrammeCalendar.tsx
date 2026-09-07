import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject, type TouchEvent } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  MapPin,
  Utensils,
  X,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import type { PosterContribution, ProgrammeEvent } from './types';

interface ProgrammeCalendarProps {
  events: ProgrammeEvent[];
  posters: PosterContribution[];
  searchQuery: string;
}

interface ClockValue {
  date: string;
  minutes: number;
}

const DESKTOP_PX_PER_MINUTE = 1.5;
const MOBILE_PX_PER_MINUTE = 2;
const AXIS_STEP_MINUTES = 30;
const TIMELINE_TOP_GUTTER = 14;
const TIMELINE_BOTTOM_GUTTER = 0;
const TIMELINE_END_MINUTES = 20 * 60 + 30;
const CONTRIBUTED_GROUP_MAX_GAP = 10;
const CONTRIBUTED_GROUP_TAIL_MINUTES = 5;
const SWIPE_DISTANCE_THRESHOLD = 0.22;
const SWIPE_VELOCITY_THRESHOLD = 0.45;
const SWIPE_AXIS_LOCK_THRESHOLD = 6;

interface SwipeGesture {
  startX: number;
  startY: number;
  startedAt: number;
  axis: 'horizontal' | 'vertical' | null;
}

const minutesFromTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const timeFromMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

const getWarsawClock = (value = new Date()): ClockValue => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: siteConfig.sheets.programme.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '00';

  return {
    date: `${part('year')}-${part('month')}-${part('day')}`,
    minutes: Number(part('hour')) * 60 + Number(part('minute')),
  };
};

const dayLabel = (date: string, variant: 'desktop' | 'mobile') => {
  const value = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: variant === 'mobile' ? 'numeric' : undefined,
    month: variant === 'mobile' ? 'long' : undefined,
  }).format(value);
};

const shortDateLabel = (date: string) => {
  const value = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  }).format(value);
};

const categoryClasses = {
  Talk: 'border-sky-300 bg-[#e7f0f8] text-slate-900',
  Food: 'border-[#cdbfa9] bg-[#eee7dc] text-[#5e5142]',
  Break: 'border-slate-300 bg-[#f1f3f4] text-slate-700',
};

const interactiveCategoryClasses = {
  Talk: 'hover:border-sky-500 hover:bg-[#dbeaf6]',
  Food: 'hover:border-[#b9a88d] hover:bg-[#e6ddcf]',
  Break: 'hover:border-slate-400 hover:bg-slate-200/70',
};

const badgeClasses = {
  Talk: 'bg-sky-900/8 text-sky-900 ring-sky-900/10',
  Food: 'bg-[#e2d8c9] text-[#5e5142] ring-[#9a8263]/20',
  Break: 'bg-slate-200/80 text-slate-600 ring-slate-500/15',
};

const isRealPdf = (url: string) => Boolean(url && !url.includes('REPLACE_'));

const searchableText = (event: ProgrammeEvent, sessionPosters: PosterContribution[]) => [
  event.start,
  event.end,
  event.type,
  event.subtype,
  event.reference,
  event.extraInfo,
  event.name,
  event.affiliation,
  event.title,
  event.description,
  ...sessionPosters.flatMap((poster) => [poster.name, poster.affiliation, poster.title, String(poster.posterNo)]),
].join(' ').toLowerCase();

interface ContributedGroup {
  kind: 'contributed-group';
  date: string;
  start: string;
  end: string;
  events: ProgrammeEvent[];
}

type TimelineEntry =
  | { kind: 'event'; event: ProgrammeEvent }
  | ContributedGroup;

const isContributedTalk = (event: ProgrammeEvent) => event.type === 'Talk' && event.subtype === 'Contributed';

const groupTimelineEvents = (events: ProgrammeEvent[]): TimelineEntry[] => {
  const sortedEvents = [...events].sort((first, second) => minutesFromTime(first.start) - minutesFromTime(second.start));
  const entries: TimelineEntry[] = [];

  for (let index = 0; index < sortedEvents.length;) {
    const event = sortedEvents[index];
    if (!isContributedTalk(event)) {
      entries.push({ kind: 'event', event });
      index += 1;
      continue;
    }

    const group = [event];
    let nextIndex = index + 1;
    while (nextIndex < sortedEvents.length) {
      const previous = group[group.length - 1];
      const next = sortedEvents[nextIndex];
      const gap = minutesFromTime(next.start) - minutesFromTime(previous.end);
      if (!isContributedTalk(next) || gap < 0 || gap > CONTRIBUTED_GROUP_MAX_GAP) break;
      group.push(next);
      nextIndex += 1;
    }

    if (group.length > 1) {
      const lastTalkEnd = minutesFromTime(group[group.length - 1].end);
      entries.push({
        kind: 'contributed-group',
        date: event.date,
        start: group[0].start,
        end: timeFromMinutes(lastTalkEnd + CONTRIBUTED_GROUP_TAIL_MINUTES),
        events: group,
      });
    } else {
      entries.push({ kind: 'event', event });
    }
    index = nextIndex;
  }

  return entries;
};

interface EventCardProps {
  key?: string;
  event: ProgrammeEvent;
  pxPerMinute: number;
  timelineStart: number;
  timelineEnd: number;
  posters: PosterContribution[];
  query: string;
  onOpenPosters: (event: ProgrammeEvent) => void;
  onOpenTalks: (events: ProgrammeEvent[]) => void;
  onOpenEvent: (event: ProgrammeEvent) => void;
}

const EventCard = ({ event, pxPerMinute, timelineStart, timelineEnd, posters, query, onOpenPosters, onOpenTalks, onOpenEvent }: EventCardProps) => {
  const start = minutesFromTime(event.start);
  const eventEnd = minutesFromTime(event.end);
  const duration = eventEnd - start;
  const visibleDuration = Math.max(0, Math.min(eventEnd, timelineEnd) - start);
  const cardHeight = visibleDuration * pxPerMinute;
  const sessionPosters = event.subtype === 'Poster session'
    ? posters.filter((poster) => poster.posterSession === event.reference)
    : [];
  const matches = !query || searchableText(event, sessionPosters).includes(query);
  const hasDetails = Boolean(event.description || event.detailsUrl);
  const compact = cardHeight < 54;
  const roomy = cardHeight >= 80;
  const isCompactEvent = event.type === 'Break' && duration <= 30;
  const showTalkLocationBelow = event.type === 'Talk' && event.subtype === 'Invited';
  const showExtraInfo = Boolean(event.extraInfo)
    && !(event.type === 'Break' && event.subtype.toLowerCase() === 'coffee break')
    && !isCompactEvent;
  const posterCount = sessionPosters.length;
  const badgeLabel = event.type === 'Food'
    ? 'Meal'
    : event.type === 'Break'
      ? 'Event'
      : event.subtype === 'Invited' || event.subtype === 'Contributed'
        ? `${event.subtype} talk`
        : event.subtype;
  const style: CSSProperties = {
    top: (start - timelineStart) * pxPerMinute,
    height: visibleDuration * pxPerMinute,
  };
  const cardClass = `absolute inset-x-1 overflow-hidden rounded-lg border text-left shadow-sm transition-[opacity,border-color,background-color,transform] ${categoryClasses[event.type]} ${matches ? 'opacity-100' : 'pointer-events-none opacity-15 grayscale'}`;

  if (visibleDuration <= 0) return null;

  const content = (
    <div className={`relative flex h-full min-h-0 flex-col overflow-hidden ${isCompactEvent ? 'justify-center p-1.5' : compact ? 'gap-1 p-1' : 'gap-1 p-1.5'}`}>
      <div className={`flex shrink-0 items-center ${isCompactEvent ? 'gap-2' : 'gap-1.5'}`}>
        <span className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-semibold tabular-nums opacity-70`}>
          {event.start}–{event.end}
        </span>
        {isCompactEvent ? (
          <span className="ml-1 min-w-0 flex-1 truncate text-sm font-semibold leading-tight">{event.subtype}</span>
        ) : (
          <span className={`truncate rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${badgeClasses[event.type]}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {event.type === 'Talk' && event.subtype !== 'Poster session' && (
        <>
          <div className="flex min-h-0 items-center gap-1.5">
            <div className="min-w-0 flex-1 truncate text-sm font-bold leading-tight">{event.name || 'To be announced'}</div>
            {showExtraInfo && !showTalkLocationBelow && (
              <div className={`${compact ? 'max-w-[42%] text-[8px]' : 'max-w-[48%] text-[9px]'} flex shrink-0 items-center gap-0.5 truncate opacity-60`}>
                <MapPin size={compact ? 8 : 10} className="shrink-0" />
                <span className="truncate">{event.extraInfo}</span>
              </div>
            )}
          </div>
          {showExtraInfo && showTalkLocationBelow && (
            <div className={`${compact ? 'text-[8px]' : 'text-[9px]'} mt-auto flex shrink-0 items-center gap-0.5 truncate opacity-60`}>
              <MapPin size={compact ? 8 : 10} className="shrink-0" />
              <span className="truncate">{event.extraInfo}</span>
            </div>
          )}
        </>
      )}

      {event.subtype === 'Poster session' && (
        <>
          <div className="text-sm font-serif font-bold uppercase leading-tight text-sky-950">Poster session</div>
          <div className={`${roomy ? 'text-sm' : 'text-[10px]'} font-semibold text-sky-800`}>{posterCount} posters</div>
          {showExtraInfo && (
            <div className="mt-auto flex items-center gap-1 truncate text-[9px] text-sky-900/60">
              <MapPin size={10} /> {event.extraInfo}
            </div>
          )}
        </>
      )}

      {event.type !== 'Talk' && !isCompactEvent && (
        <>
          <div className="truncate text-sm font-semibold leading-tight">{event.subtype}</div>
          {showExtraInfo && (
            <div className={`${compact ? 'text-[8px]' : 'text-[9px]'} mt-auto flex items-center gap-1 truncate opacity-65`}>
              {event.type === 'Food' ? <Utensils size={compact ? 8 : 10} /> : <MapPin size={compact ? 8 : 10} />}
              {event.extraInfo}
            </div>
          )}
          {hasDetails && (
            <div className="mt-auto flex items-center gap-1 text-[9px] font-medium opacity-55">
              <FileText size={10} /> Open details
            </div>
          )}
        </>
      )}
    </div>
  );

  if (event.subtype === 'Poster session') {
    return (
      <button type="button" style={style} className={`${cardClass} ${interactiveCategoryClasses[event.type]} cursor-pointer hover:-translate-y-px`} onClick={() => onOpenPosters(event)}>
        {content}
      </button>
    );
  }

  if (event.type === 'Talk') {
    return (
      <button
        type="button"
        style={style}
        className={`${cardClass} ${interactiveCategoryClasses[event.type]} cursor-pointer hover:-translate-y-px`}
        onClick={() => onOpenTalks([event])}
        aria-label={`${event.start}–${event.end}, ${badgeLabel}, ${event.name || 'To be announced'}, open details`}
      >
        {content}
      </button>
    );
  }

  if (hasDetails) {
    return (
      <button
        type="button"
        style={style}
        className={`${cardClass} ${interactiveCategoryClasses[event.type]} cursor-pointer hover:-translate-y-px`}
        onClick={() => onOpenEvent(event)}
        aria-label={`${event.start}–${event.end}, ${event.subtype}, open details`}
      >
        {content}
      </button>
    );
  }

  return <div style={style} className={cardClass}>{content}</div>;
};

interface ContributedGroupCardProps {
  key?: string;
  group: ContributedGroup;
  pxPerMinute: number;
  timelineStart: number;
  timelineEnd: number;
  query: string;
  onOpenTalks: (events: ProgrammeEvent[]) => void;
}

const ContributedGroupCard = ({ group, pxPerMinute, timelineStart, timelineEnd, query, onOpenTalks }: ContributedGroupCardProps) => {
  const start = minutesFromTime(group.start);
  const visibleDuration = Math.max(0, Math.min(minutesFromTime(group.end), timelineEnd) - start);
  const locations = [...new Set(group.events.map((event) => event.extraInfo).filter(Boolean))];
  const location = locations.length === 1 ? locations[0] : locations.length > 1 ? 'Multiple rooms' : '';
  const matches = !query || group.events.some((event) => searchableText(event, []).includes(query));
  const style: CSSProperties = {
    top: (start - timelineStart) * pxPerMinute,
    height: visibleDuration * pxPerMinute,
  };

  if (visibleDuration <= 0) return null;

  return (
    <button
      type="button"
      style={style}
      className={`absolute inset-x-1 cursor-pointer overflow-hidden rounded-lg border text-left shadow-sm transition-[opacity,border-color,background-color,transform] ${categoryClasses.Talk} ${interactiveCategoryClasses.Talk} ${matches ? 'opacity-100 hover:-translate-y-px' : 'pointer-events-none opacity-15 grayscale'}`}
      onClick={() => onOpenTalks(group.events)}
      aria-label={`${group.start}–${group.end}, contributed talks, ${group.events.length} speakers, open details`}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col gap-1 p-1.5">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-[10px] font-semibold tabular-nums opacity-70">{group.start}–{group.end}</span>
          <span className={`truncate rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${badgeClasses.Talk}`}>
            Contributed talks
          </span>
        </div>
        <div className="text-sm font-bold leading-tight text-sky-950">{group.events.length} speakers</div>
        {location && (
          <div className="mt-auto flex items-center gap-1 truncate text-[9px] opacity-60">
            <MapPin size={10} /> {location}
          </div>
        )}
      </div>
    </button>
  );
};

interface NowLineProps {
  now: ClockValue;
  timelineStart: number;
  timelineEnd: number;
  pxPerMinute: number;
  markerRef?: RefObject<HTMLDivElement | null>;
}

const NowLine = ({ now, timelineStart, timelineEnd, pxPerMinute, markerRef }: NowLineProps) => {
  if (now.minutes < timelineStart || now.minutes > timelineEnd) return null;

  return (
    <div
      ref={markerRef}
      className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-red-500"
      style={{ top: (now.minutes - timelineStart) * pxPerMinute }}
      aria-label="Current time"
    >
      <span className="absolute -left-px -top-[11px] rounded-r bg-red-500 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white">NOW</span>
    </div>
  );
};

interface TalkDetailsDialogProps {
  events: ProgrammeEvent[] | null;
  onClose: () => void;
}

const TalkDetailsDialog = ({ events, onClose }: TalkDetailsDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (events?.length && dialog && !dialog.open) dialog.showModal();
    if (!events?.length && dialog?.open) dialog.close();
  }, [events]);

  const firstEvent = events?.[0];
  const lastEvent = events?.[events.length - 1];
  const isGroup = Boolean(events && events.length > 1);
  const locations = [...new Set((events ?? []).map((event) => event.extraInfo).filter(Boolean))];

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto h-fit max-h-[88vh] w-[min(820px,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 max-md:h-[100dvh] max-md:max-h-none max-md:w-full max-md:rounded-none"
    >
      {events?.length && firstEvent && lastEvent && (
        <div className="flex max-h-[88vh] flex-col max-md:h-full max-md:max-h-none">
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-slate-200 bg-sky-50 px-5 py-5 md:px-8">
            <div className="min-w-0">
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                {firstEvent.start}–{lastEvent.end}
              </div>
              <h4 className="text-2xl font-serif font-semibold text-primary-900">
                {isGroup ? 'Contributed talks' : `${firstEvent.subtype} talk`}
              </h4>
              {locations.length > 0 && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={14} /> {locations.join(' · ')}
                </p>
              )}
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900" aria-label="Close talk details">
              <X size={22} />
            </button>
          </div>

          <div className={`min-h-0 overflow-y-auto overscroll-contain px-4 py-3 md:px-8 md:py-5 ${isGroup ? 'flex-1' : 'flex-none'}`}>
            {events.map((talk) => (
              <article key={`${talk.start}-${talk.reference}`} className="border-b border-slate-100 py-5 first:pt-2 last:border-0 last:pb-2">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold tabular-nums text-sky-800">{talk.start}–{talk.end}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ring-1 ring-inset ${badgeClasses.Talk}`}>
                    {talk.subtype} talk
                  </span>
                </div>
                <h5 className="font-sans text-base font-bold text-slate-900 md:text-lg">{talk.name || 'To be announced'}</h5>
                {talk.affiliation && <p className="mt-1 text-sm text-slate-500">{talk.affiliation}</p>}
                {talk.title && <p className="mt-3 font-serif text-lg leading-snug text-primary-900 md:text-xl">{talk.title}</p>}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {talk.extraInfo ? (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} /> {talk.extraInfo}</span>
                  ) : <span />}
                  {isRealPdf(talk.abstractUrl) ? (
                    <a href={talk.abstractUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-800">
                      Open abstract PDF <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><FileText size={14} /> Abstract unavailable</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
};

interface PosterDialogProps {
  event: ProgrammeEvent | null;
  posters: PosterContribution[];
  onClose: () => void;
}

const PosterDialog = ({ event, posters, onClose }: PosterDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (event && dialog && !dialog.open) dialog.showModal();
    if (!event && dialog?.open) dialog.close();
  }, [event]);

  const sessionPosters = useMemo(() => {
    if (!event) return [];
    return posters
      .filter((poster) => poster.posterSession === event.reference)
      .sort((a, b) => a.posterNo - b.posterNo);
  }, [event, posters]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto h-auto max-h-[88vh] w-[min(920px,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 max-md:h-[100dvh] max-md:max-h-none max-md:w-full max-md:rounded-none"
    >
      {event && (
        <div className="flex h-full max-h-[88vh] flex-col max-md:max-h-none">
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-slate-200 bg-sky-50 px-5 py-5 md:px-8">
            <div>
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{event.start}–{event.end} · {event.reference}</div>
              <h4 className="text-2xl font-serif font-semibold text-primary-900">Poster session</h4>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> {event.extraInfo} · {sessionPosters.length} posters</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900" aria-label="Close poster list">
              <X size={22} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 md:px-8 md:py-5">
            {sessionPosters.map((poster) => (
              <article key={poster.contributionId} className="grid grid-cols-[3rem_1fr_auto] gap-3 border-b border-slate-100 py-4 last:border-0 md:grid-cols-[4rem_1fr_auto] md:gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-900 md:h-12 md:w-12">#{poster.posterNo}</div>
                <div className="min-w-0">
                  <h5 className="font-sans text-sm font-semibold text-slate-900 md:text-base">{poster.title}</h5>
                  <p className="mt-1 text-sm font-medium text-slate-700">{poster.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{poster.affiliation}</p>
                </div>
                {isRealPdf(poster.abstractUrl) ? (
                  <a href={poster.abstractUrl} target="_blank" rel="noreferrer" className="self-center rounded-full border border-sky-200 p-2 text-sky-700 transition hover:bg-sky-50" aria-label={`Open abstract PDF for poster ${poster.posterNo}`}>
                    <ExternalLink size={17} />
                  </a>
                ) : (
                  <FileText size={17} className="self-center text-slate-300" aria-label="Sample PDF link" />
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
};

interface EventDetailsDialogProps {
  event: ProgrammeEvent | null;
  onClose: () => void;
}

const EventDetailsDialog = ({ event, onClose }: EventDetailsDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (event && dialog && !dialog.open) dialog.showModal();
    if (!event && dialog?.open) dialog.close();
  }, [event]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(clickEvent) => {
        if (clickEvent.target === clickEvent.currentTarget) onClose();
      }}
      className="m-auto h-fit max-h-[88vh] w-[min(680px,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 max-md:h-[100dvh] max-md:max-h-none max-md:w-full max-md:rounded-none"
    >
      {event && (
        <div className="flex max-h-[88vh] flex-col max-md:h-full max-md:max-h-none">
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-slate-200 bg-slate-100 px-5 py-5 md:px-8">
            <div className="min-w-0">
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {dayLabel(event.date, 'mobile')} · {event.start}–{event.end}
              </div>
              <h4 className="text-2xl font-serif font-semibold text-primary-900">{event.title || event.subtype}</h4>
              {event.extraInfo && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={14} /> {event.extraInfo}
                </p>
              )}
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900" aria-label="Close event details">
              <X size={22} />
            </button>
          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 md:px-8 md:py-7">
            <p className="font-serif text-lg leading-relaxed text-slate-700 md:text-xl">
              {event.description || 'Details to be announced.'}
            </p>
            {event.detailsUrl && (
              <a href={event.detailsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-800">
                Open additional information <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
};

interface TimelineProps {
  key?: string;
  day: string;
  events: ProgrammeEvent[];
  posters: PosterContribution[];
  query: string;
  timelineStart: number;
  timelineEnd: number;
  pxPerMinute: number;
  now: ClockValue;
  markerRef?: RefObject<HTMLDivElement | null>;
  onOpenPosters: (event: ProgrammeEvent) => void;
  onOpenTalks: (events: ProgrammeEvent[]) => void;
  onOpenEvent: (event: ProgrammeEvent) => void;
}

const Timeline = ({ day, events, posters, query, timelineStart, timelineEnd, pxPerMinute, now, markerRef, onOpenPosters, onOpenTalks, onOpenEvent }: TimelineProps) => {
  const entries = groupTimelineEvents(events);

  return (
    <div
      className="relative min-w-0 border-l border-slate-200 bg-white"
      style={{ height: TIMELINE_TOP_GUTTER + (timelineEnd - timelineStart) * pxPerMinute + TIMELINE_BOTTOM_GUTTER }}
    >
      <div
        className="absolute inset-x-0 overflow-hidden bg-white"
        style={{
          top: TIMELINE_TOP_GUTTER,
          height: (timelineEnd - timelineStart) * pxPerMinute,
          backgroundImage: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.28) 1px, transparent 1px)',
          backgroundSize: `100% ${AXIS_STEP_MINUTES * pxPerMinute}px`,
        }}
      >
        {entries.map((entry, index) => entry.kind === 'contributed-group' ? (
          <ContributedGroupCard
            key={`${entry.date}-${entry.start}-${entry.end}-${index}`}
            group={entry}
            pxPerMinute={pxPerMinute}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
            query={query}
            onOpenTalks={onOpenTalks}
          />
        ) : (
          <EventCard
            key={`${entry.event.date}-${entry.event.start}-${entry.event.reference || entry.event.subtype}-${index}`}
            event={entry.event}
            pxPerMinute={pxPerMinute}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
            posters={posters}
            query={query}
            onOpenPosters={onOpenPosters}
            onOpenTalks={onOpenTalks}
            onOpenEvent={onOpenEvent}
          />
        ))}
        {now.date === day && (
          <NowLine now={now} timelineStart={timelineStart} timelineEnd={timelineEnd} pxPerMinute={pxPerMinute} markerRef={markerRef} />
        )}
      </div>
    </div>
  );
};

export const ProgrammeCalendar = ({ events, posters, searchQuery }: ProgrammeCalendarProps) => {
  const days = useMemo(() => [...new Set(events.map((event) => event.date))].sort(), [events]);
  const [now, setNow] = useState<ClockValue>(() => getWarsawClock());
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = getWarsawClock().date;
    return days.includes(today) ? today : days[0];
  });
  const [posterEvent, setPosterEvent] = useState<ProgrammeEvent | null>(null);
  const [talkEvents, setTalkEvents] = useState<ProgrammeEvent[] | null>(null);
  const [detailEvent, setDetailEvent] = useState<ProgrammeEvent | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeGesture = useRef<SwipeGesture | null>(null);
  const swipeConsumed = useRef(false);
  const swipeResetTimer = useRef<number | null>(null);
  const mobileTimelineViewport = useRef<HTMLDivElement>(null);
  const mobileNowMarker = useRef<HTMLDivElement>(null);
  const query = searchQuery.trim().toLowerCase();

  const timelineStart = useMemo(() => {
    const earliest = Math.min(...events.map((event) => minutesFromTime(event.start)));
    return Math.floor(earliest / AXIS_STEP_MINUTES) * AXIS_STEP_MINUTES;
  }, [events]);
  const timelineEnd = TIMELINE_END_MINUTES;
  const ticks = useMemo(() => {
    const values: number[] = [];
    for (let value = timelineStart; value <= timelineEnd; value += AXIS_STEP_MINUTES) values.push(value);
    return values;
  }, [timelineEnd, timelineStart]);
  const selectedIndex = Math.max(0, days.indexOf(selectedDay));
  const matchingCount = events.filter((event) => {
    const sessionPosters = event.subtype === 'Poster session' ? posters.filter((poster) => poster.posterSession === event.reference) : [];
    return !query || searchableText(event, sessionPosters).includes(query);
  }).length;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(getWarsawClock()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => {
    if (swipeResetTimer.current !== null) window.clearTimeout(swipeResetTimer.current);
  }, []);

  useEffect(() => {
    if (!days.includes(selectedDay)) setSelectedDay(days[0]);
  }, [days, selectedDay]);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1279px)').matches;
    if (isMobile && selectedDay === now.date && mobileNowMarker.current) {
      window.setTimeout(() => mobileNowMarker.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    }
  }, [now.date, selectedDay]);

  const changeDay = (direction: -1 | 1) => {
    const next = Math.min(days.length - 1, Math.max(0, selectedIndex + direction));
    setSelectedDay(days[next]);
  };

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch || event.touches.length !== 1) return;

    swipeGesture.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startedAt: performance.now(),
      axis: null,
    };
    swipeConsumed.current = false;
    setSwipeProgress(0);
  };

  const onTouchMove = (event: TouchEvent) => {
    const gesture = swipeGesture.current;
    const touch = event.touches[0];
    if (!gesture || !touch) return;

    const distanceX = touch.clientX - gesture.startX;
    const distanceY = touch.clientY - gesture.startY;

    if (!gesture.axis) {
      if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < SWIPE_AXIS_LOCK_THRESHOLD) return;
      gesture.axis = Math.abs(distanceX) > Math.abs(distanceY) ? 'horizontal' : 'vertical';
    }

    if (gesture.axis !== 'horizontal') return;
    if (event.cancelable) event.preventDefault();

    const viewportWidth = mobileTimelineViewport.current?.clientWidth ?? window.innerWidth;
    let progress = distanceX / Math.max(1, viewportWidth);
    const pullingPastFirstDay = selectedIndex === 0 && progress > 0;
    const pullingPastLastDay = selectedIndex === days.length - 1 && progress < 0;
    if (pullingPastFirstDay || pullingPastLastDay) progress *= 0.22;

    swipeConsumed.current = Math.abs(distanceX) > SWIPE_AXIS_LOCK_THRESHOLD;
    setIsSwiping(true);
    setSwipeProgress(Math.max(-1, Math.min(1, progress)));
  };

  const finishSwipe = (event: TouchEvent) => {
    const gesture = swipeGesture.current;
    if (!gesture) return;

    const touch = event.changedTouches[0];
    const distanceX = touch ? touch.clientX - gesture.startX : 0;
    const distanceY = touch ? touch.clientY - gesture.startY : 0;
    const elapsed = Math.max(1, performance.now() - gesture.startedAt);
    const velocity = distanceX / elapsed;
    const viewportWidth = mobileTimelineViewport.current?.clientWidth ?? window.innerWidth;
    const distanceProgress = distanceX / Math.max(1, viewportWidth);
    const horizontalGesture = gesture.axis === 'horizontal'
      || (gesture.axis === null
        && Math.abs(distanceX) > Math.abs(distanceY)
        && Math.abs(distanceX) >= SWIPE_AXIS_LOCK_THRESHOLD);
    const shouldChangeDay = horizontalGesture
      && (Math.abs(distanceProgress) >= SWIPE_DISTANCE_THRESHOLD
        || (Math.abs(velocity) >= SWIPE_VELOCITY_THRESHOLD && Math.abs(distanceX) >= 30));

    if (shouldChangeDay) changeDay(distanceX > 0 ? -1 : 1);

    swipeGesture.current = null;
    setIsSwiping(false);
    setSwipeProgress(0);

    if (swipeConsumed.current) {
      if (swipeResetTimer.current !== null) window.clearTimeout(swipeResetTimer.current);
      swipeResetTimer.current = window.setTimeout(() => {
        swipeConsumed.current = false;
        swipeResetTimer.current = null;
      }, 350);
    }
  };

  const cancelSwipe = () => {
    swipeGesture.current = null;
    setIsSwiping(false);
    setSwipeProgress(0);
  };

  const mobileTrackStyle: CSSProperties = {
    transform: `translate3d(calc(${-selectedIndex * 100}% + ${swipeProgress * 100}%), 0, 0)`,
  };

  const mobileTrackClass = `flex w-full will-change-transform ${isSwiping
    ? ''
    : 'transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'}`;

  if (!days.length) return null;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f0f8] px-2.5 py-1 ring-1 ring-inset ring-sky-200"><span className="h-2 w-2 rounded-full bg-sky-500" /> Talks</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eee7dc] px-2.5 py-1 text-[#5e5142] ring-1 ring-inset ring-[#cdbfa9]/70"><span className="h-2 w-2 rounded-full bg-[#9a8263]" /> Meals</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f3f4] px-2.5 py-1 text-slate-600 ring-1 ring-inset ring-slate-300"><span className="h-2 w-2 rounded-full bg-slate-400" /> Events</span>
        </div>
        {query && <div className="text-xs text-slate-500">{matchingCount} matching {matchingCount === 1 ? 'event' : 'events'}</div>}
      </div>

      <div className="relative hidden rounded-xl border border-slate-200 xl:block">
        <div className="sticky top-16 z-30 grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] overflow-hidden rounded-t-[11px] bg-primary-900 text-white shadow-lg">
          <div className="flex items-center justify-center border-r border-white/10"><CalendarDays size={17} className="opacity-60" /></div>
          {days.map((day) => (
            <div key={day} className="border-r border-white/10 px-2 py-3 text-center last:border-r-0">
              <div className="text-sm font-bold">{dayLabel(day, 'desktop')}</div>
              <div className="mt-0.5 text-[10px] text-white/55">{shortDateLabel(day)}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] overflow-hidden rounded-b-[11px]">
          <div className="relative bg-white" style={{ height: TIMELINE_TOP_GUTTER + (timelineEnd - timelineStart) * DESKTOP_PX_PER_MINUTE + TIMELINE_BOTTOM_GUTTER }}>
            {ticks.map((tick) => (
              <span key={tick} className={`absolute right-2 tabular-nums text-slate-500 ${tick === timelineEnd ? '-translate-y-full' : '-translate-y-1/2'} ${tick % 60 === 0 ? 'text-[10px] font-semibold' : 'text-[9px]'}`} style={{ top: TIMELINE_TOP_GUTTER + (tick - timelineStart) * DESKTOP_PX_PER_MINUTE }}>
                {timeFromMinutes(tick)}
              </span>
            ))}
          </div>
          {days.map((day) => (
            <Timeline
              key={day}
              day={day}
              events={events.filter((event) => event.date === day)}
              posters={posters}
              query={query}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
              pxPerMinute={DESKTOP_PX_PER_MINUTE}
              now={now}
              onOpenPosters={setPosterEvent}
              onOpenTalks={setTalkEvents}
              onOpenEvent={setDetailEvent}
            />
          ))}
        </div>
      </div>

      <div
        className="touch-pan-y xl:hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={finishSwipe}
        onTouchCancel={cancelSwipe}
        onClickCapture={(event) => {
          if (!swipeConsumed.current) return;
          event.preventDefault();
          event.stopPropagation();
          swipeConsumed.current = false;
        }}
      >
        <div className="sticky top-16 z-30 mb-3 flex items-center justify-between rounded-xl bg-primary-900 px-2 py-2 text-white shadow-lg">
          <button type="button" onClick={() => changeDay(-1)} disabled={selectedIndex === 0} className="rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-25" aria-label="Previous day">
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-0 flex-1 overflow-hidden text-center" aria-live="polite">
            <div className={mobileTrackClass} style={mobileTrackStyle}>
              {days.map((day) => (
                <div key={day} className="w-full shrink-0" aria-hidden={day !== selectedDay}>
                  <div className="text-sm font-bold">{dayLabel(day, 'mobile')}</div>
                  <div className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/50">Swipe to change day</div>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => changeDay(1)} disabled={selectedIndex === days.length - 1} className="rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-25" aria-label="Next day">
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-slate-200">
          <div className="relative bg-white" style={{ height: TIMELINE_TOP_GUTTER + (timelineEnd - timelineStart) * MOBILE_PX_PER_MINUTE + TIMELINE_BOTTOM_GUTTER }}>
            {ticks.map((tick) => (
              <span key={tick} className={`absolute right-1.5 tabular-nums text-slate-500 ${tick === timelineEnd ? '-translate-y-full' : '-translate-y-1/2'} ${tick % 60 === 0 ? 'text-[10px] font-semibold' : 'text-[9px]'}`} style={{ top: TIMELINE_TOP_GUTTER + (tick - timelineStart) * MOBILE_PX_PER_MINUTE }}>
                {timeFromMinutes(tick)}
              </span>
            ))}
          </div>
          <div ref={mobileTimelineViewport} className="min-w-0 overflow-hidden">
            <div className={mobileTrackClass} style={mobileTrackStyle}>
              {days.map((day) => (
                <div key={day} className="w-full shrink-0">
                  <Timeline
                    day={day}
                    events={events.filter((event) => event.date === day)}
                    posters={posters}
                    query={query}
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    pxPerMinute={MOBILE_PX_PER_MINUTE}
                    now={now}
                    markerRef={day === selectedDay ? mobileNowMarker : undefined}
                    onOpenPosters={setPosterEvent}
                    onOpenTalks={setTalkEvents}
                    onOpenEvent={setDetailEvent}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TalkDetailsDialog events={talkEvents} onClose={() => setTalkEvents(null)} />
      <PosterDialog event={posterEvent} posters={posters} onClose={() => setPosterEvent(null)} />
      <EventDetailsDialog event={detailEvent} onClose={() => setDetailEvent(null)} />
    </>
  );
};
