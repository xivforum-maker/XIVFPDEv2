import React from 'react';

export interface ScheduleSlot {
  name: string;
  title: string;
}

export interface ScheduleRow {
  time: string;
  days: ScheduleSlot[];
  rawText: string;
}

interface ScheduleTableProps {
  filteredSchedule: ScheduleRow[];
  dayNames: string[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ filteredSchedule, dayNames }) => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
              <th className="py-4 px-3 text-center font-bold rounded-tl-xl whitespace-nowrap text-sm">Time</th>
              {dayNames.map((day, i) => (
                <th key={day} className={`py-4 px-4 text-center font-bold ${i === 4 ? 'rounded-tr-xl' : ''}`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 last:border-0 transition-colors ${i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'}`}>
                  <td className="py-4 px-3 text-center font-bold text-primary-900 bg-primary-50/30 border-r border-gray-100 whitespace-nowrap text-sm">
                    {row.time}
                  </td>
                  {row.days.map((slot, j) => (
                    <td key={j} className="py-4 px-4 text-center align-middle border-r border-gray-100 last:border-0">
                      {slot.name && (
                        <div className="font-bold text-gray-900 text-sm">{slot.name}</div>
                      )}
                      {slot.title && (
                        <div className="text-xs text-gray-500 mt-1 italic">{slot.title}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No matching items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-8">
        {filteredSchedule.length > 0 ? (
          dayNames.map((day, dayIdx) => {
            const hasContent = filteredSchedule.some(row => 
              row.days[dayIdx].name || row.days[dayIdx].title
            );
            
            if (!hasContent) return null;

            return (
              <div key={day} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-primary-900 text-white px-4 py-3 font-bold uppercase tracking-wider text-sm">
                  {day}
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredSchedule
                    .filter(row => row.days[dayIdx].name || row.days[dayIdx].title)
                    .map((row, i) => {
                    const slot = row.days[dayIdx];
                    
                    return (
                      <div key={i} className={`flex p-4 gap-3 items-center transition-colors ${i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'}`}>
                        <div className="flex-shrink-0 text-center">
                          <span className="inline-block px-2 py-1 bg-primary-50 text-primary-900 font-bold text-xs rounded-lg whitespace-nowrap">
                            {row.time}
                          </span>
                        </div>
                        <div className="flex-grow">
                          {slot.name && <div className="font-bold text-gray-900 text-sm">{slot.name}</div>}
                          {slot.title && <div className="text-xs text-gray-500 mt-1 italic">{slot.title}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-gray-500 border border-gray-100 rounded-xl">
            No matching items found.
          </div>
        )}
      </div>
    </>
  );
};
