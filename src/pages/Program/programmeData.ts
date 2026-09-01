import { siteConfig } from '../../config/site';
import type {
  ContributionType,
  PosterContribution,
  ProgrammeContribution,
  ProgrammeData,
  ProgrammeEvent,
  ProgrammeEventType,
} from './types';

type GvizCell = { v?: string | number | null; f?: string | null } | null;
type GvizResponse = {
  status?: string;
  table?: {
    cols?: Array<{ label?: string }>;
    rows?: Array<{ c?: GvizCell[] }>;
  };
};

const valueOf = (cell: GvizCell): string => {
  if (!cell) return '';
  const value = cell.f ?? cell.v ?? '';
  return String(value).trim();
};

const fetchGvizRows = async (gid: string, range?: string): Promise<string[][]> => {
  const { id, cacheMinutes } = siteConfig.sheets.programme;
  const cacheBucket = Math.floor(Date.now() / (cacheMinutes * 60_000));
  const query = encodeURIComponent('select * where A is not null');
  const rangeParam = range ? `&range=${encodeURIComponent(range)}` : '';
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?gid=${gid}${rangeParam}&headers=1&tqx=out:json&tq=${query}&_=${cacheBucket}`;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6_000);
  let response: Response;

  try {
    response = await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);

  const payload = await response.text();
  const match = payload.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
  if (!match) throw new Error('Invalid Google Sheets response');

  const data = JSON.parse(match[1]) as GvizResponse;
  if (data.status === 'error' || !data.table?.rows) throw new Error('Programme data is unavailable');

  return data.table.rows.map((row) => (row.c ?? []).map(valueOf));
};

const toEvent = (row: string[]): ProgrammeEvent | null => {
  const [date, start, end, type, subtype, reference, extraInfo, name, affiliation, title, abstractUrl, posterCount, issues, description, detailsUrl] = row;
  if (!date || !start || !end || !['Talk', 'Food', 'Break'].includes(type)) return null;

  return {
    date,
    start: start.slice(0, 5),
    end: end.slice(0, 5),
    type: type as ProgrammeEventType,
    subtype: subtype ?? '',
    reference: reference ?? '',
    extraInfo: extraInfo ?? '',
    name: name ?? '',
    affiliation: affiliation ?? '',
    title: title ?? '',
    abstractUrl: abstractUrl ?? '',
    posterCount: posterCount ? Number(posterCount) : null,
    issues: issues ?? '',
    description: description ?? '',
    detailsUrl: detailsUrl ?? '',
  };
};

const toPoster = (row: string[]): PosterContribution | null => {
  const [posterSession, posterNo, contributionId, name, affiliation, title, abstractUrl] = row;
  if (!posterSession || !posterNo || !contributionId) return null;

  return {
    posterSession,
    posterNo: Number(posterNo),
    contributionId,
    name: name ?? '',
    affiliation: affiliation ?? '',
    title: title ?? '',
    abstractUrl: abstractUrl ?? '',
  };
};

const toContribution = (row: string[]): ProgrammeContribution | null => {
  const [id, firstName, lastName, , type, affiliation, title, abstractUrl, posterNo, posterSession] = row;
  if (!id || !firstName || !lastName || !['Invited', 'Contributed', 'Poster'].includes(type)) return null;

  const parsedPosterNo = posterNo ? Number(posterNo) : null;

  return {
    id,
    firstName,
    lastName,
    type: type as ContributionType,
    affiliation: affiliation ?? '',
    title: title ?? '',
    abstractUrl: abstractUrl ?? '',
    posterNo: parsedPosterNo !== null && Number.isFinite(parsedPosterNo) ? parsedPosterNo : null,
    posterSession: posterSession ?? '',
  };
};

const demoEvents: ProgrammeEvent[] = [
  ['2026-09-14', '09:00', '09:30', 'Break', 'Registration', '', 'Foyer', '', '', '', '', null, ''],
  ['2026-09-14', '09:30', '10:30', 'Talk', 'Invited', 'ANNA_KOWALSKA', 'Main Hall', 'Anna Kowalska', 'Institute of Mathematics, Polish Academy of Sciences', 'Nonlinear diffusion and singular structures', '', null, ''],
  ['2026-09-14', '10:30', '11:00', 'Break', 'Coffee break', '', 'Foyer', '', '', '', '', null, ''],
  ['2026-09-14', '13:00', '13:20', 'Talk', 'Contributed', 'JAKUB_ZIELIŃSKI', 'Main Hall', 'Jakub Zieliński', 'Wrocław University of Science and Technology', 'A priori estimates for degenerate systems', '', null, ''],
  ['2026-09-14', '16:00', '18:00', 'Talk', 'Poster session', 'PS1', 'Main Hall', '', '', '', '', 3, ''],
  ['2026-09-14', '19:00', '20:00', 'Food', 'Dinner', '', 'Restaurant', '', '', '', '', null, ''],
  ['2026-09-15', '09:00', '10:00', 'Talk', 'Invited', 'DANIEL_NOVAK', 'Main Hall', 'Daniel Novak', 'Charles University', 'Long-time behaviour of dissipative PDEs', '', null, ''],
  ['2026-09-15', '10:00', '10:20', 'Talk', 'Contributed', 'TOMASZ_WIŚNIEWSKI', 'Main Hall', 'Tomasz Wiśniewski', 'Jagiellonian University', 'Entropy solutions for an anisotropic model', '', null, ''],
  ['2026-09-15', '10:40', '11:00', 'Break', 'Coffee break', '', 'Foyer', '', '', '', '', null, ''],
  ['2026-09-15', '12:00', '13:00', 'Food', 'Lunch', '', 'Restaurant', '', '', '', '', null, ''],
  ['2026-09-15', '15:00', '17:00', 'Break', 'Excursion', '', 'Bus departure from Będlewo', '', '', '', '', null, ''],
  ['2026-09-16', '09:00', '10:00', 'Talk', 'Invited', 'GRACE_CHEN', 'Main Hall', 'Grace Chen', 'University of Cambridge', 'Geometric flows with rough initial data', '', null, ''],
  ['2026-09-16', '12:00', '13:00', 'Food', 'Lunch', '', 'Restaurant', '', '', '', '', null, ''],
  ['2026-09-16', '16:00', '18:00', 'Talk', 'Poster session', 'PS2', 'Main Hall', '', '', '', '', 3, ''],
  ['2026-09-16', '19:00', '21:00', 'Food', 'Conference dinner', '', 'Conference restaurant', '', '', '', '', null, ''],
  ['2026-09-17', '09:00', '10:00', 'Talk', 'Invited', 'ROBERT_KELLER', 'Main Hall', 'Robert Keller', 'TU Berlin', 'Nonlocal operators and their local limits', '', null, ''],
  ['2026-09-17', '10:00', '10:30', 'Break', 'Coffee break', '', 'Foyer', '', '', '', '', null, ''],
  ['2026-09-17', '11:30', '12:30', 'Food', 'Lunch', '', 'Restaurant', '', '', '', '', null, ''],
  ['2026-09-17', '15:00', '17:00', 'Break', 'Excursion', '', 'Będlewo grounds', '', '', '', '', null, ''],
  ['2026-09-18', '09:00', '10:00', 'Talk', 'Invited', 'HELENA_SØRENSEN', 'Main Hall', 'Helena Sørensen', 'University of Copenhagen', 'Interfaces, defects and pattern selection', '', null, ''],
  ['2026-09-18', '10:30', '11:30', 'Break', 'Organisational', '', 'Panel discussion — Main Hall', '', '', '', '', null, ''],
  ['2026-09-18', '11:30', '12:30', 'Food', 'Lunch', '', 'Restaurant', '', '', '', '', null, ''],
  ['2026-09-18', '12:30', '13:30', 'Break', 'Organisational', '', 'Closing session — Main Hall', '', '', '', '', null, ''],
].map(([date, start, end, type, subtype, reference, extraInfo, name, affiliation, title, abstractUrl, posterCount, issues]) => ({
  date: date as string,
  start: start as string,
  end: end as string,
  type: type as ProgrammeEventType,
  subtype: subtype as string,
  reference: reference as string,
  extraInfo: extraInfo as string,
  name: name as string,
  affiliation: affiliation as string,
  title: title as string,
  abstractUrl: abstractUrl as string,
  posterCount: posterCount as number | null,
  issues: issues as string,
}));

const demoPosters: PosterContribution[] = [
  { posterSession: 'PS1', posterNo: 1, contributionId: 'ALICE_BROWN', name: 'Alice Brown', affiliation: 'University of Leeds', title: 'Adaptive discretisation for nonlinear diffusion', abstractUrl: '' },
  { posterSession: 'PS1', posterNo: 2, contributionId: 'BRUNO_COSTA', name: 'Bruno Costa', affiliation: 'University of Porto', title: 'Pattern formation with delayed feedback', abstractUrl: '' },
  { posterSession: 'PS1', posterNo: 3, contributionId: 'EMILIA_NOWAK', name: 'Emilia Nowak', affiliation: 'Adam Mickiewicz University', title: 'Numerical continuation of travelling fronts', abstractUrl: '' },
  { posterSession: 'PS2', posterNo: 6, contributionId: 'HIRO_TANAKA', name: 'Hiro Tanaka', affiliation: 'Osaka University', title: 'Multi-scale limits in porous media', abstractUrl: '' },
  { posterSession: 'PS2', posterNo: 7, contributionId: 'INGRID_OLSEN', name: 'Ingrid Olsen', affiliation: 'University of Oslo', title: 'Vortex dynamics in thin domains', abstractUrl: '' },
  { posterSession: 'PS2', posterNo: 8, contributionId: 'KARIM_HADDAD', name: 'Karim Haddad', affiliation: 'American University of Beirut', title: 'Inverse problems for nonlinear sources', abstractUrl: '' },
];

const nameParts = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) ?? '',
  };
};

const demoContributions: ProgrammeContribution[] = [
  ...demoEvents
    .filter((event) => event.type === 'Talk' && ['Invited', 'Contributed'].includes(event.subtype) && event.name)
    .map((event) => ({
      id: event.reference,
      ...nameParts(event.name),
      type: event.subtype as ContributionType,
      affiliation: event.affiliation,
      title: event.title,
      abstractUrl: event.abstractUrl,
      posterNo: null,
      posterSession: '',
    })),
  ...demoPosters.map((poster) => ({
    id: poster.contributionId,
    ...nameParts(poster.name),
    type: 'Poster' as const,
    affiliation: poster.affiliation,
    title: poster.title,
    abstractUrl: poster.abstractUrl,
    posterNo: poster.posterNo,
    posterSession: poster.posterSession,
  })),
];

export const getProgrammeData = async (): Promise<ProgrammeData> => {
  try {
    const { contributionsGid, eventsGid, postersGid } = siteConfig.sheets.programme;
    const [eventRows, posterRows, contributionRows] = await Promise.all([
      fetchGvizRows(eventsGid),
      fetchGvizRows(postersGid),
      fetchGvizRows(contributionsGid, 'A4:L300'),
    ]);

    const events = eventRows.map(toEvent).filter((event): event is ProgrammeEvent => Boolean(event));
    const posters = posterRows.map(toPoster).filter((poster): poster is PosterContribution => Boolean(poster));
    const contributions = contributionRows
      .map(toContribution)
      .filter((contribution): contribution is ProgrammeContribution => Boolean(contribution));
    if (!events.length) throw new Error('The programme is empty');

    return { events, posters, contributions, source: 'sheet' };
  } catch (error) {
    console.warn('Using built-in programme preview:', error);
    return { events: demoEvents, posters: demoPosters, contributions: demoContributions, source: 'demo' };
  }
};
