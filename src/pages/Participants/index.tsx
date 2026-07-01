import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Loader2, ArrowUpAZ, ArrowDownAZ, ChevronDown } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { siteConfig } from '../../config/site';
import { ParticipantsTable, Participant } from './ParticipantsTable';


export const ParticipantsPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Participant, direction: 'asc' | 'desc' }>({ key: 'surname', direction: 'asc' });

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { id, gid } = siteConfig.sheets.participants;
        const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}&tq=${encodeURIComponent("select A, B, C where A is not null")}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const text = await response.text();
        const jsonString = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);
        
        const data = json.table.rows.map((row: any) => ({
          name: row.c[0]?.v || '',
          surname: row.c[1]?.v || '',
          affiliation: row.c[2]?.v || ''
        }));
        
        setParticipants(data);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setError("Failed to load participants list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...participants];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.surname.toLowerCase().includes(query) ||
        p.affiliation.toLowerCase().includes(query)
      );
    }

    const collator = new Intl.Collator(['pl', 'de', 'en'], {
      sensitivity: 'base',
      usage: 'sort',
    });
    
    result.sort((a, b) => {
      const comparison = collator.compare(
        a[sortConfig.key],
        b[sortConfig.key]
      );

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [participants, searchQuery, sortConfig]);

  const handleSort = (key: keyof Participant) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSortKeyChange = (key: keyof Participant) => {
    setSortConfig(current => ({
      ...current,
      key
    }));
  };

  const sortOptions: Array<{ key: keyof Participant; label: string }> = [
    { key: 'surname', label: 'Surname' },
    { key: 'name', label: 'Name' },
    { key: 'affiliation', label: 'Affiliation' }
  ];

  return (
    <main className="flex-grow relative pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Participants" subtitle="List of registered attendees" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-white/70"
        >
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-primary-900 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-100">
                    <Users size={22} />
                  </span>
                  Participants
                </h3>
                {!loading && !error && (
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-primary-900">{participants.length}</span> registered participants • {searchQuery ? <><span className="font-semibold text-primary-900">{filteredAndSorted.length}</span> matching search</> : 'Auto-updated from Google Sheets'}
                  </p>
                )}
              </div>
              
              {!loading && !error && (
                <div className="flex w-full flex-col gap-2 sm:w-auto md:hidden">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sort by</span>
                  <div className="flex gap-2">
                    <label className="relative flex-1">
                      <select
                        value={sortConfig.key}
                        onChange={(event) => handleSortKeyChange(event.target.value as keyof Participant)}
                        className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-500"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.key} value={option.key}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSort(sortConfig.key)}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-accent-200 hover:text-primary-900"
                      title="Reverse sort direction"
                      aria-label="Reverse sort direction"
                    >
                      {sortConfig.direction === 'asc' ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="relative w-full lg:max-w-md lg:pt-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, surname, or affiliation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm transition-all"
                />
              </div>
            </div>
            
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
              <Loader2 size={40} className="animate-spin mb-4 text-accent-500" />
              <p>Loading participants list...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p>{error}</p>
            </div>
          ) : (
            <ParticipantsTable 
              filteredAndSorted={filteredAndSorted} 
              sortConfig={sortConfig} 
              handleSort={handleSort}
              searchQuery={searchQuery}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
};
