import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ExternalLink, Calendar, Search, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { siteConfig } from '../../config/site';
import { ScheduleTable, ScheduleRow, ScheduleSlot } from './ScheduleTable';

export const ProgramPage = () => {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { id, gid, range } = siteConfig.sheets.schedule;
        const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?gid=${gid}&range=${range}&tqx=out:json`;
        const response = await fetch(url);
        const text = await response.text();
        
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
        if (!match) throw new Error("Invalid response format");
        
        const data = JSON.parse(match[1]);
        const rows = data.table.rows;
        
        const parsedSchedule: ScheduleRow[] = [];
        
        for (let i = 0; i < rows.length; i += 2) {
          const nameRow = rows[i]?.c || [];
          const titleRow = rows[i + 1]?.c || [];
          
          const time = nameRow[0]?.v || "";
          const days: ScheduleSlot[] = [];
          let rawText = time + " ";
          
          for (let col = 1; col <= 5; col++) {
            const name = nameRow[col]?.v || "";
            const title = titleRow[col]?.v || "";
            days.push({ name, title });
            rawText += `${name} ${title} `;
          }
          
          parsedSchedule.push({ time, days, rawText: rawText.toLowerCase() });
        }
        
        setSchedule(parsedSchedule);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setError("Failed to load schedule. Please try again later.");
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const filteredSchedule = schedule.filter(row => 
    searchQuery === "" || row.rawText.includes(searchQuery.toLowerCase())
  );

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <main className="flex-grow relative pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Programme & Abstracts" subtitle="Schedule and submissions" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <div className="text-center mb-12">
            <BookOpen size={48} className="mx-auto text-accent-500 mb-6" />
            <h3 className="text-2xl font-serif text-primary-900 mb-4">Abstract Submission</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Deadline for abstract submission: <strong className="text-primary-900">{siteConfig.deadlines.abstracts}</strong>
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Please note that abstract submission requires a Google account.
            </p>
            <a 
              href={siteConfig.links.abstractSubmission}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-8 py-3 bg-primary-900 hover:bg-primary-800 text-white font-medium rounded-full transition-all"
            >
              Submit Abstract <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
            <h4 className="text-lg font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-600" /> Alternative Submission
            </h4>
            <p className="text-blue-800">
              If you wish to submit an abstract without using a Google account, please send your abstract directly to the conference organizers at <a href={`mailto:${siteConfig.contactEmail}`} className="font-bold hover:underline">{siteConfig.contactEmail}</a>.
            </p>
          </div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-serif text-primary-900 flex items-center gap-2">
                <Calendar className="text-accent-500" /> Conference Schedule
              </h3>
              <p className="text-sm text-gray-500 mt-1">Auto-updated from Google Sheets</p>
            </div>
            
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search (speaker / title)…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 sm:text-sm transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-accent-500 mb-4"></div>
              <p className="text-gray-500">Loading schedule...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 bg-red-50 rounded-xl">
              <p>{error}</p>
            </div>
          ) : (
            <ScheduleTable filteredSchedule={filteredSchedule} dayNames={dayNames} />
          )}
        </motion.div>
      </div>
    </main>
  );
};
