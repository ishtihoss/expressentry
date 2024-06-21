import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaClipboardList, FaSave } from "react-icons/fa";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

type Stream = 'FSWP' | 'FSTP' | 'CEC' | 'PNP';

const ExpressEntryChecklist = () => {
  const [selectedStream, setSelectedStream] = useState<Stream | ''>('');
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<Stream, boolean[]>>({
    FSWP: [],
    FSTP: [],
    CEC: [],
    PNP: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

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

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('checklist_progress')
      .select('progress')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error loading progress:', error);
    } else if (data) {
      setCheckedItems(data.progress);
    }
  };

  const handleStreamClick = (stream: Stream) => {
    setSelectedStream(stream);
  };

  const toggleChecklist = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (stream: Stream, index: number) => {
    const newCheckedItems = { ...checkedItems };
    newCheckedItems[stream][index] = !newCheckedItems[stream][index];
    setCheckedItems(newCheckedItems);
  };

  const saveProgress = async () => {
    if (!user) {
      console.log("Attempt to save without user:", user);
      alert('Please sign in to save your progress.');
      return;
    }
  
    setIsSaving(true);
    console.log("Saving progress for user:", user.id);
  
    const { data, error } = await supabase
      .from('checklist_progress')
      .upsert({ 
        user_id: user.id, 
        progress: checkedItems, 
        stream: selectedStream 
      }, { 
        onConflict: 'user_id'
      });
  
    setIsSaving(false);
  
    if (error) {
      console.error('Error saving progress:', error);
      alert(`Failed to save progress. Error: ${error.message}`);
    } else {
      console.log("Progress saved successfully:", data);
      alert('Progress saved successfully!');
    }
  };

  const calculateProgress = (stream: Stream) => {
    const totalItems = checklists[stream].length;
    const checkedCount = checkedItems[stream].filter(Boolean).length;
    return (checkedCount / totalItems) * 100;
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
            className="fixed bottom-20 right-8 bg-white rounded-lg shadow-lg p-4 border border-primary w-80 max-h-[80vh] overflow-y-auto safe-top"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-bold mb-4 text-primary text-center sticky top-0 bg-white pt-4">Express Entry Checklist</h2>
            {user ? (
              <>
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
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${calculateProgress(selectedStream)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 text-center">
                        Progress: {calculateProgress(selectedStream).toFixed(0)}%
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {checklists[selectedStream].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`item-${selectedStream}-${index}`}
                            className="form-checkbox h-4 w-4 text-primary-dark mr-2"
                            checked={checkedItems[selectedStream][index] || false}
                            onChange={() => handleCheckboxChange(selectedStream, index)}
                          />
                          <label htmlFor={`item-${selectedStream}-${index}`} className="text-gray-700 text-sm">{item}</label>
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      className="mt-4 w-full bg-primary text-white rounded-md py-2 flex items-center justify-center"
                      onClick={saveProgress}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={isSaving}
                    >
                      <FaSave className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Progress'}
                    </motion.button>
                  </motion.div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600">Please sign in to use the checklist.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpressEntryChecklist;