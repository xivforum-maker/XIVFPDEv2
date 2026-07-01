import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Building2, SearchX } from 'lucide-react';

export interface Participant {
  name: string;
  surname: string;
  affiliation: string;
}

interface ParticipantsTableProps {
  filteredAndSorted: Participant[];
  sortConfig: { key: keyof Participant; direction: 'asc' | 'desc' };
  handleSort: (key: keyof Participant) => void;
  searchQuery: string;
}

const getInitials = (participant: Participant) => {
  const first = participant.name.trim().charAt(0);
  const last = participant.surname.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || 'FP';
};

const highlightText = (value: string, query: string) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return value;

  const index = value.toLowerCase().indexOf(trimmedQuery.toLowerCase());
  if (index === -1) return value;

  return (
    <>
      {value.slice(0, index)}
      <mark className="rounded bg-accent-100 px-0.5 text-primary-900">
        {value.slice(index, index + trimmedQuery.length)}
      </mark>
      {value.slice(index + trimmedQuery.length)}
    </>
  );
};

const EmptyState = () => (
  <div className="py-16 text-center text-gray-500 bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
    <SearchX size={34} className="mx-auto mb-3 text-gray-300" />
    <p className="font-medium text-gray-700">No participants found</p>
    <p className="text-sm mt-1">Try a different name or affiliation.</p>
  </div>
);

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  filteredAndSorted,
  sortConfig,
  handleSort,
  searchQuery,
}) => {
  const SortIcon = ({ columnKey }: { columnKey: keyof Participant }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400 ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-accent-300 ml-1" /> 
      : <ArrowDown size={14} className="text-accent-300 ml-1" />;
  };

  const ParticipantCard: React.FC<{ participant: Participant }> = ({ participant }) => (
    <article className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-900 text-sm font-bold tracking-wide text-white shadow-sm ring-4 ring-accent-50">
          {getInitials(participant)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-primary-900 leading-snug">
            {highlightText(participant.name, searchQuery)} {highlightText(participant.surname, searchQuery)}
          </h4>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <Building2 size={16} className="mt-0.5 shrink-0 text-accent-500" />
            <span className="leading-relaxed">{highlightText(participant.affiliation, searchQuery)}</span>
          </div>
        </div>
      </div>
    </article>
  );

  if (filteredAndSorted.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-900 shadow-sm">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-primary-800 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name <SortIcon columnKey="name" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-primary-800 transition-colors"
                  onClick={() => handleSort('surname')}
                >
                  <div className="flex items-center">
                    Surname <SortIcon columnKey="surname" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-primary-800 transition-colors"
                  onClick={() => handleSort('affiliation')}
                >
                  <div className="flex items-center">
                    Affiliation <SortIcon columnKey="affiliation" />
                  </div>
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-100">
              {filteredAndSorted.map((participant, idx) => (
                <tr key={`${participant.name}-${participant.surname}-${idx}`} className="transition-colors odd:bg-white even:bg-gray-50/50 hover:bg-accent-50/60">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900 text-xs font-bold tracking-wide text-white shadow-sm">
                        {getInitials(participant)}
                      </span>
                      <span>{highlightText(participant.name, searchQuery)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {highlightText(participant.surname, searchQuery)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <Building2 size={15} className="mt-0.5 shrink-0 text-accent-500" />
                      <span>{highlightText(participant.affiliation, searchQuery)}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredAndSorted.map((participant, idx) => (
          <ParticipantCard key={`mobile-${participant.name}-${participant.surname}-${idx}`} participant={participant} />
        ))}
      </div>
    </>
  );
};
