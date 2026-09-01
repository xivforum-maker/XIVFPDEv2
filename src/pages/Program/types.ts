export type ProgrammeEventType = 'Talk' | 'Food' | 'Break';
export type ContributionType = 'Invited' | 'Contributed' | 'Poster';

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

export interface ProgrammeContribution {
  id: string;
  firstName: string;
  lastName: string;
  type: ContributionType;
  affiliation: string;
  title: string;
  abstractUrl: string;
  posterNo: number | null;
  posterSession: string;
}

export interface ProgrammeData {
  events: ProgrammeEvent[];
  posters: PosterContribution[];
  contributions: ProgrammeContribution[];
  source: 'sheet' | 'demo';
}
