import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  MapPin,
  Mic2,
  Users,
  X,
} from 'lucide-react';
import type { ContributionType, ProgrammeContribution, ProgrammeEvent } from './types';

interface SpeakersDirectoryProps {
  contributions: ProgrammeContribution[];
  events: ProgrammeEvent[];
  loading: boolean;
}

type DirectoryFilter = 'All' | ContributionType;

interface ScheduledContribution extends ProgrammeContribution {
  event: ProgrammeEvent | null;
}

interface SpeakerGroup {
  key: string;
  firstName: string;
  lastName: string;
  affiliations: string[];
  contributions: ScheduledContribution[];
}

const collator = new Intl.Collator(['en', 'pl'], { sensitivity: 'base' });

const speakerKey = (contribution: ProgrammeContribution) =>
  `${contribution.firstName.trim()}\u0000${contribution.lastName.trim()}`.toLocaleLowerCase();

const isRealPdf = (url: string) => Boolean(url && !url.includes('REPLACE_'));

const dateLabel = (date: string) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
}).format(new Date(`${date}T12:00:00Z`));

const typeLabels: Record<ContributionType, string> = {
  Invited: 'Invited talk',
  Contributed: 'Contributed talk',
  Poster: 'Poster',
};

const typeBadgeClasses: Record<ContributionType, string> = {
  Invited: 'bg-primary-900 text-white ring-primary-900/10',
  Contributed: 'bg-sky-100 text-sky-800 ring-sky-200',
  Poster: 'bg-amber-100 text-amber-800 ring-amber-200',
};

const contributionSortKey = (contribution: ScheduledContribution) => {
  if (!contribution.event) return `9999-99-99T99:99-${contribution.type}-${contribution.title}`;
  return `${contribution.event.date}T${contribution.event.start}-${contribution.type}-${contribution.title}`;
};

const groupContributions = (
  contributions: ProgrammeContribution[],
  events: ProgrammeEvent[],
): SpeakerGroup[] => {
  const groups = new Map<string, SpeakerGroup>();

  for (const contribution of contributions) {
    const event = contribution.type === 'Poster'
      ? events.find((item) => item.subtype === 'Poster session' && item.reference === contribution.posterSession) ?? null
      : events.find((item) => item.type === 'Talk' && item.subtype === contribution.type && item.reference === contribution.id) ?? null;
    const key = speakerKey(contribution);
    const group = groups.get(key) ?? {
      key,
      firstName: contribution.firstName,
      lastName: contribution.lastName,
      affiliations: [],
      contributions: [],
    };

    if (contribution.affiliation && !group.affiliations.includes(contribution.affiliation)) {
      group.affiliations.push(contribution.affiliation);
    }
    group.contributions.push({ ...contribution, event });
    groups.set(key, group);
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      contributions: group.contributions.sort((first, second) =>
        collator.compare(contributionSortKey(first), contributionSortKey(second))),
    }))
    .sort((first, second) =>
      collator.compare(first.lastName, second.lastName)
      || collator.compare(first.firstName, second.firstName));
};

const speakerCount = (contributions: ProgrammeContribution[]) =>
  new Set(contributions.map(speakerKey)).size;

export const SpeakersDirectory = ({ contributions, events, loading }: SpeakersDirectoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<DirectoryFilter>('All');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const allSpeakers = useMemo(() => groupContributions(contributions, events), [contributions, events]);
  // Licznik "speakers" obejmuje wyłącznie wystąpienia ustne (Invited + Contributed) —
  // osoba prezentująca sam plakat nie jest liczona jako prelegent. Licznik
  // "contributions" pozostaje pełny, czyli razem z plakatami.
  const talkSpeakerCount = useMemo(
    () => speakerCount(contributions.filter((item) => item.type !== 'Poster')),
    [contributions],
  );
  const visibleContributions = useMemo(() => activeFilter === 'All'
    ? contributions
    : contributions.filter((contribution) => contribution.type === activeFilter), [activeFilter, contributions]);
  const visibleSpeakers = useMemo(() => groupContributions(visibleContributions, events), [events, visibleContributions]);

  const filters = useMemo(() => ([
    { value: 'All' as const, label: 'All', count: allSpeakers.length },
    { value: 'Invited' as const, label: 'Invited', count: speakerCount(contributions.filter((item) => item.type === 'Invited')) },
    { value: 'Contributed' as const, label: 'Contributed', count: speakerCount(contributions.filter((item) => item.type === 'Contributed')) },
    { value: 'Poster' as const, label: 'Posters', count: speakerCount(contributions.filter((item) => item.type === 'Poster')) },
  ]), [allSpeakers.length, contributions]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mx-auto mb-12 max-w-6xl"
        aria-labelledby="speakers-directory-heading"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={loading || contributions.length === 0}
          className="group flex w-full cursor-pointer flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60 sm:flex-row sm:items-center sm:p-8"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-800 transition group-hover:bg-sky-200">
            <Users size={28} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">Programme index</span>
            <span id="speakers-directory-heading" className="block text-2xl font-serif font-semibold text-primary-900">Speakers &amp; contributions</span>
            <span className="mt-1 block max-w-3xl text-sm leading-relaxed text-slate-600">
              Speakers, times and abstracts — A–Z.
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3 self-stretch border-t border-slate-100 pt-4 text-sm font-semibold text-primary-900 sm:self-auto sm:border-l sm:border-t-0 sm:py-2 sm:pl-6 sm:pt-2">
            {loading ? 'Loading…' : `${talkSpeakerCount} speakers`}
            <ArrowRight size={18} className="text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </button>
      </motion.section>

      <dialog
        ref={dialogRef}
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        className="m-auto h-auto max-h-[90vh] w-[min(1040px,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 max-md:h-[100dvh] max-md:max-h-none max-md:w-full max-md:rounded-none"
      >
        <div className="flex h-full max-h-[90vh] flex-col max-md:max-h-none">
          <div className="flex shrink-0 items-start justify-between gap-6 border-b border-slate-200 bg-sky-50 px-5 py-5 md:px-8">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                <Mic2 size={14} aria-hidden="true" /> Programme index
              </div>
              <h4 className="text-2xl font-serif font-semibold text-primary-900">Speakers &amp; contributions</h4>
              <p className="mt-1 text-sm text-slate-500">
                {talkSpeakerCount} speakers · {contributions.length} contributions · alphabetical by surname
              </p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900" aria-label="Close speaker list">
              <X size={22} />
            </button>
          </div>

          <div className="shrink-0 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8">
            <div className="flex min-w-max gap-2" role="group" aria-label="Filter speakers by contribution type">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={activeFilter === filter.value}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${activeFilter === filter.value
                    ? 'bg-primary-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
                >
                  {filter.label} <span className={activeFilter === filter.value ? 'text-white/60' : 'text-slate-400'}>{filter.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 md:px-8 md:py-5">
            {visibleSpeakers.map((speaker) => (
              <article key={speaker.key} className="grid gap-4 border-b border-slate-100 py-5 first:pt-2 last:border-0 last:pb-2 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-8">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 font-serif text-lg font-bold text-sky-900">
                    {speaker.lastName.charAt(0).toLocaleUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-sans text-base font-bold text-slate-900">{speaker.firstName} {speaker.lastName}</h5>
                    {speaker.affiliations.map((affiliation) => (
                      <p key={affiliation} className="mt-1 text-xs leading-relaxed text-slate-500">{affiliation}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {speaker.contributions.map((contribution) => (
                    <div key={contribution.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${typeBadgeClasses[contribution.type]}`}>
                          {typeLabels[contribution.type]}
                        </span>
                        {contribution.type === 'Poster' && contribution.posterNo !== null && (
                          <span className="text-xs font-semibold text-slate-500">Poster #{contribution.posterNo}</span>
                        )}
                      </div>

                      <p className={`mt-2 font-serif text-lg leading-snug ${contribution.title ? 'text-primary-900' : 'italic text-slate-400'}`}>
                        {contribution.title || 'Title to be announced'}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                        {contribution.event ? (
                          <>
                            <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {dateLabel(contribution.event.date)}</span>
                            <span className="inline-flex items-center gap-1.5 tabular-nums"><Clock3 size={13} /> {contribution.event.start}–{contribution.event.end}</span>
                            {contribution.event.extraInfo && (
                              <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {contribution.event.extraInfo}</span>
                            )}
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-amber-700"><Clock3 size={13} /> Time to be announced</span>
                        )}

                        <span className="ml-auto">
                          {isRealPdf(contribution.abstractUrl) ? (
                            <a href={contribution.abstractUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1.5 font-semibold text-sky-700 transition hover:bg-sky-50">
                              Abstract <ExternalLink size={13} />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-slate-400"><FileText size={13} /> Abstract unavailable</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};
