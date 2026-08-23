export type ProgrammeEventType = 'Talk' | 'Food' | 'Break';

export interface ProgrammeEvent {
  date: string;
  start: string;
  end: string;
  type: ProgrammeEventType;
  subtype: string;
  reference: string;
  extraInfo: string;
  name: string;
  affiliation: string;
  title: string;
  abstractUrl: string;
  posterCount: number | null;
  issues: string;
  description?: string;
  detailsUrl?: string;
}

export interface PosterContribution {
  posterSession: string;
  posterNo: number;
  contributionId: string;
  name: string;
  affiliation: string;
  title: string;
  abstractUrl: string;
}

export interface ProgrammeData {
  events: ProgrammeEvent[];
  posters: PosterContribution[];
  source: 'sheet' | 'demo';
}
