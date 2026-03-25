import React from 'react';
import { motion } from 'motion/react';
import { Users, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { organizingCommittee } from '../../data/committee';
import { siteConfig } from '../../config/site';

export const OrganizingCommitteePage = () => {
  return (
    <main className="flex-grow relative pb-24">
      <div className="absolute inset-0 z-[-1] bg-gray-50/90 backdrop-blur-[3px]" />
      <PageHeader title="Organizing Committee" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div 
          className="flex flex-wrap justify-center gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {organizingCommittee.map((member, idx) => (
            <motion.div 
              key={idx}
              className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)]"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <a
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="block h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-300 cursor-pointer group"
              >
                <div className="w-24 h-24 mx-auto bg-accent-50 rounded-full flex items-center justify-center text-accent-600 mb-6 transition-transform duration-300 group-hover:scale-105 group-hover:bg-accent-100 overflow-hidden border-2 border-transparent group-hover:border-accent-200">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users size={32} />
                  )}
                </div>
                <h4 className="text-xl font-serif font-bold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">{member.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{member.affiliation}</p>
                <span className="inline-flex items-center text-sm font-medium text-accent-600 group-hover:text-accent-700 transition-colors">
                  Website <ExternalLink size={14} className="ml-1" />
                </span>
              </a>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            For any inquiries, please contact the organizers at <br />
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent-600 font-medium hover:underline text-lg mt-2 inline-block">{siteConfig.contactEmail}</a>
          </p>
        </div>
      </div>
    </main>
  );
};
