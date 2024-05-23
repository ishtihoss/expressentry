// components/ExpressEntryChecklist.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaClipboardList } from "react-icons/fa";

type Stream = 'FSWP' | 'FSTP' | 'CEC' | 'PNP';

const ExpressEntryChecklist = () => {
  const [selectedStream, setSelectedStream] = useState<Stream | ''>('');
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleChecklist = () => {
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const checklistVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
  };

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 bg-primary text-white rounded-full p-4 shadow-lg focus:outline-none"
        onClick={toggleChecklist}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaClipboardList size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-8 bg-white rounded-lg shadow-lg p-4 border border-primary w-80"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-bold mb-4 text-primary text-center">Express Entry Checklist</h2>
            <div className="flex justify-center space-x-2 mb-6">
              {streams.map((stream) => (
                <motion.button
                  key={stream}
                  className={`px-3 py-1 rounded-md font-semibold text-sm ${
                    selectedStream === stream ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
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
              <motion.div variants={checklistVariants}>
                <h3 className="text-lg font-semibold mb-4 text-primary-dark text-center">{selectedStream} Checklist</h3>
                <ul className="space-y-2">
                  {checklists[selectedStream].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`item-${index}`}
                        className="form-checkbox h-4 w-4 text-primary-dark mr-2"
                      />
                      <label htmlFor={`item-${index}`} className="text-gray-700 text-sm">{item}</label>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpressEntryChecklist;