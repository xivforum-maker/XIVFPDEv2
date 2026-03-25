import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Building2 } from 'lucide-react';

export interface Participant {
  name: string;
  surname: string;
  affiliation: string;
}

interface ParticipantsTableProps {
  filteredAndSorted: Participant[];
  sortConfig: { key: keyof Participant; direction: 'asc' | 'desc' };
  handleSort: (key: keyof Participant) => void;
}

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  filteredAndSorted,
  sortConfig,
  handleSort,
}) => {
  const SortIcon = ({ columnKey }: { columnKey: keyof Participant }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400 ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-accent-500 ml-1" /> 
      : <ArrowDown size={14} className="text-accent-500 ml-1" />;
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-900">
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
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((participant, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {participant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {participant.surname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {participant.affiliation}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No participants found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((participant, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
              <div className="font-bold text-gray-900 text-lg">
                {participant.name} {participant.surname}
              </div>
              <div className="text-sm text-gray-600 flex items-start gap-2">
                <Building2 size={16} className="mt-0.5 text-accent-500 shrink-0" />
                <span>{participant.affiliation}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
            No participants found matching your search.
          </div>
        )}
      </div>
    </>
  );
};
