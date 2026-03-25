import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { scientificCommittee } from '../../data/committee';

export const ScientificCommitteePage = () => {
  return (
    <main className="flex-grow relative pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Scientific Committee" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div 
          className="flex flex-wrap justify-center gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {scientificCommittee.map((member, idx) => (
            <motion.div 
              key={idx}
              className="w-full md:w-[calc(50%-12px)]"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <a 
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="block h-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-300 cursor-pointer group"
              >
                <div className="bg-primary-50 p-3 rounded-lg text-primary-900 shrink-0 transition-colors group-hover:bg-primary-100">
                  <GraduationCap size={24} />
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-serif font-bold text-primary-900 group-hover:text-accent-600 transition-colors">{member.name}</h4>
                  <p className="text-gray-600 text-sm mt-1 mb-3">{member.affiliation}</p>
                  <span className="inline-flex items-center text-sm font-medium text-accent-600 group-hover:text-accent-700 transition-colors">
                    Website <ExternalLink size={14} className="ml-1" />
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
};
