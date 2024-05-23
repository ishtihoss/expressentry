// components/ExpressEntryChecklist.tsx
import { motion } from "framer-motion";
import { useState } from "react";

type Stream = 'FSWP' | 'FSTP' | 'CEC' | 'PNP';

const ExpressEntryChecklist = () => {
  const [selectedStream, setSelectedStream] = useState<Stream | ''>('');

  const streams: Stream[] = ['FSWP', 'FSTP', 'CEC', 'PNP'];

  const checklists: Record<Stream, string[]> = {
    FSWP: [
      'Passport or travel document',
      'Language test results',
      'Educational Credential Assessment (ECA)',
      'Proof of Canadian education or foreign credentials',
      'Proof of funds',
      'Proof of work experience',
      'Provincial nomination (if applicable)',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
    FSTP: [
      'Passport or travel document',
      'Language test results',
      'Proof of Canadian education or foreign credentials',
      'Proof of funds',
      'Proof of work experience',
      'Certificate of qualification in a skilled trade issued by a Canadian province or territory',
      'Provincial nomination (if applicable)',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
    CEC: [
      'Passport or travel document',
      'Language test results',
      'Proof of Canadian education or foreign credentials (if applicable)',
      'Proof of Canadian work experience',
      'Provincial nomination (if applicable)',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
    PNP: [
      'Passport or travel document',
      'Language test results',
      'Educational Credential Assessment (ECA) (if applicable)',
      'Proof of Canadian education or foreign credentials',
      'Proof of funds',
      'Proof of work experience',
      'Provincial nomination certificate',
      'Written job offer from a Canadian employer (if applicable)',
      'Police certificates',
      'Medical exams',
      'Birth certificates (for dependent children, if applicable)',
      'Marriage or divorce certificates (if applicable)',
      'Adoption certificate (if applicable)',
      'Common-law union form (if applicable)',
    ],
  };

  const handleStreamClick = (stream: Stream) => {
    setSelectedStream(stream);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const checklistVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <motion.div
      className="container mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-4 text-primary">Express Entry Checklist</h1>
      <div className="flex justify-center mb-8">
        {streams.map((stream) => (
          <motion.button
            key={stream}
            className={`px-4 py-2 rounded-md ${
              selectedStream === stream ? 'bg-primary text-white' : 'bg-background'
            }`}
            onClick={() => handleStreamClick(stream)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {stream}
          </motion.button>
        ))}
      </div>
      {selectedStream && (
        <motion.div variants={checklistVariants} initial="hidden" animate="visible">
          <h2 className="text-xl font-bold mb-2 text-primary-dark">{selectedStream} Checklist</h2>
          <ul className="space-y-2">
            {checklists[selectedStream].map((item, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`item-${index}`}
                  className="mr-2"
                />
                <label htmlFor={`item-${index}`} className="text-gray-700">{item}</label>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpressEntryChecklist;