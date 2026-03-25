import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Loader2 } from 'lucide-react';
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
    let result = participants;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.surname.toLowerCase().includes(query) ||
        p.affiliation.toLowerCase().includes(query)
      );
    }
    
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [participants, searchQuery, sortConfig]);

  const handleSort = (key: keyof Participant) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <main className="flex-grow relative pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Participants" subtitle="List of registered attendees" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-serif text-primary-900 flex items-center gap-3">
                <Users className="text-accent-500" />
                Participants
              </h3>
              {!loading && !error && (
                <p className="text-sm text-gray-500 mt-1">
                  {participants.length} registered participants • Auto-updated from Google Sheets
                </p>
              )}
            </div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search (name / affiliation)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 sm:text-sm transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
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
            />
          )}
        </motion.div>
      </div>
    </main>
  );
};
