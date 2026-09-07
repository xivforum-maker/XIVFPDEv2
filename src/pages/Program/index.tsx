import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, BookOpen, Calendar, Database, ExternalLink, Info, Search } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { siteConfig } from '../../config/site';
import { ProgrammeCalendar } from './ProgrammeCalendar';
import { SpeakersDirectory } from './SpeakersDirectory';
import { getProgrammeData } from './programmeData';
import type { ProgrammeData } from './types';

export const ProgramPage = () => {
  const [data, setData] = useState<ProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;

    getProgrammeData().then((programme) => {
      if (!active) return;
      setData(programme);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="relative flex-grow pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Programme & Abstracts" subtitle="Conference schedule and submissions" />

      <div className="relative z-10 mx-auto -mt-8 max-w-[1600px] px-3 sm:px-6 lg:px-8">
        

        {/* <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mb-12 max-w-6xl rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-6"
          aria-labelledby="programme-status-heading"
        >
          <h3 id="programme-status-heading" className="mb-2 flex items-center gap-2 text-lg font-medium text-blue-900">
            <Info size={20} className="text-blue-600" aria-hidden="true" /> Programme in preparation
          </h3>
          <div className="space-y-3 text-blue-800">
            <p>
              Please note that the conference programme is currently being prepared and may be adjusted as organizational details are finalized.
            </p>
            <p>
              Invited talks are planned for 45 minutes, while contributed talks are planned for 25 minutes. Short intervals between talks are reserved for questions, speaker changes, and technical preparation.
            </p>
          </div>
        </motion.aside> */}

        <SpeakersDirectory
          contributions={data?.contributions ?? []}
          events={data?.events ?? []}
          loading={loading}
        />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-12 rounded-2xl bg-white p-4 shadow-xl sm:p-6 lg:p-8"
          aria-labelledby="conference-programme-heading"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h3 id="conference-programme-heading" className="flex items-center gap-2 text-2xl font-serif text-primary-900">
                <Calendar className="text-accent-500" /> Conference programme
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <Database size={14} className="text-emerald-600" />
                {data?.source === 'sheet' ? 'Live data from Google Sheets' : 'Programme preview'} · Europe/Warsaw
              </p>
            </div>

            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search programme</span>
              <Search size={18} className="pointer-events-none absolute inset-y-0 left-3 my-auto text-gray-400" />
              <input
                type="search"
                placeholder="Search speaker, title or event…"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30"
              />
            </label>
          </div>

          {data?.source === 'demo' && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              The Google Sheet is not public yet, so this preview uses built-in sample entries. Once access is enabled, the page will switch to the full spreadsheet automatically.
            </div>
          )}

          {loading || !data ? (
            <div className="py-24 text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-accent-500" />
              <p className="text-sm text-gray-500">Loading programme…</p>
            </div>
          ) : (
            <ProgrammeCalendar events={data.events} posters={data.posters} searchQuery={searchQuery} />
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 max-w-6xl rounded-2xl bg-white p-8 shadow-xl md:p-12"
          aria-labelledby="abstract-submission-heading"
        >
          <div className="mb-12 text-center">
            <BookOpen size={48} className="mx-auto mb-6 text-accent-500" />
            <h3 id="abstract-submission-heading" className="mb-4 text-2xl font-serif text-primary-900">Abstract Submission</h3>
            <p className="mx-auto mb-4 max-w-2xl text-gray-600">
              Deadline for abstract submission: <strong className="text-primary-900">{siteConfig.deadlines.abstracts}</strong>
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-gray-600">Please note that abstract submission requires a Google account.</p>
            <a
              href={siteConfig.links.abstractSubmission}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-primary-900 px-8 py-3 font-medium text-white transition-all hover:bg-primary-800"
            >
              Submit Abstract <ExternalLink size={16} className="ml-2" />
            </a>
          </div>

          <div className="rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-6">
            <h4 className="mb-2 flex items-center gap-2 text-lg font-medium text-blue-900">
              <AlertCircle size={20} className="text-blue-600" /> Alternative Submission
            </h4>
            <p className="text-blue-800">
              If you wish to submit an abstract without using a Google account, please send your abstract directly to the conference organizers at{' '}
              <a href={`mailto:${siteConfig.contactEmail}`} className="font-bold hover:underline">{siteConfig.contactEmail}</a>.
            </p>
          </div>
        </motion.section>
        
      </div>
    </main>
  );
};
