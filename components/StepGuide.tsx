import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  description: string;
}

interface Step {
  title: string;
  tasks: Task[];
  milestone: string;
}

interface StepGuideProps {
  steps: Step[];
  completedTasks: {[key: number]: number[]};
  onTaskCompletion: (stepIndex: number, taskIndex: number) => void;
  totalTasks: number;
}

export const StepGuide: React.FC<StepGuideProps> = ({ steps, completedTasks, onTaskCompletion, totalTasks }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completedTaskCount = Object.values(completedTasks).flat().length;
    setProgress((completedTaskCount / totalTasks) * 100);
  }, [completedTasks, totalTasks]);

  return (
    <div className="font-pixel bg-green-800 p-4 sm:p-6 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-800 p-4 rounded-lg shadow-inner mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-base sm:text-lg">Progress</span>
          <span className="text-yellow-300 text-base sm:text-lg">{Math.round(progress)}%</span>
        </div>
        <div className="bg-gray-600 h-6 sm:h-8 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="relative">
        {/* Start flag */}
        <div className="absolute top-0 left-0 w-6 sm:w-8 h-12 sm:h-16 bg-red-600 border-2 border-white z-10" />
        <div className="absolute top-12 sm:top-16 left-0 w-6 sm:w-8 h-6 sm:h-8 bg-white border-2 border-red-600 z-10" />
        <div className="absolute top-0 left-6 sm:left-8 w-2 h-18 sm:h-24 bg-gray-800 z-10" />

        {/* Finish flag */}
        <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-12 sm:h-16 bg-black border-2 border-white z-10 
                        bg-checkerboard-white-black" />
        <div className="absolute bottom-12 sm:bottom-16 right-0 w-6 sm:w-8 h-6 sm:h-8 bg-white border-2 border-black z-10" />
        <div className="absolute bottom-0 right-6 sm:right-8 w-2 h-18 sm:h-24 bg-gray-800 z-10" />

        {/* Road */}
        <div className="absolute top-9 sm:top-12 left-3 sm:left-4 right-3 sm:right-4 bottom-9 sm:bottom-12 
                        bg-gradient-to-br from-gray-600 to-gray-700
                        border-2 sm:border-4 border-yellow-400" />

        {/* Steps */}
        <div className="relative z-20 py-6 sm:py-12 px-2 sm:px-8">
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} 
                 className={`flex flex-col sm:flex-row mb-8 sm:mb-16 ${stepIndex % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center 
                               border-2 sm:border-4 ${completedTasks[stepIndex]?.length === step.tasks.length 
                                 ? 'bg-green-500 border-yellow-400' 
                                 : 'bg-gray-700 border-gray-500'} mx-auto sm:mx-0 mb-4 sm:mb-0`}>
                <span className="text-xl sm:text-2xl font-bold text-white">{stepIndex + 1}</span>
              </div>
              <div className={`flex-1 ${stepIndex % 2 === 0 ? 'sm:ml-6' : 'sm:mr-6'}`}>
                <div className="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md text-white">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 text-yellow-300">{step.title}</h2>
                  <div className="mb-2">
                    <h3 className="font-medium mb-1 text-blue-300 text-sm sm:text-base">Tasks:</h3>
                    <ul className="space-y-1">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`task-${stepIndex}-${taskIndex}`}
                            checked={completedTasks[stepIndex]?.includes(taskIndex)}
                            onChange={() => onTaskCompletion(stepIndex, taskIndex)}
                            className="mr-2 h-4 w-4 text-yellow-400 focus:ring-yellow-500 border-gray-600 rounded"
                          />
                          <label 
                            htmlFor={`task-${stepIndex}-${taskIndex}`}
                            className="text-xs sm:text-sm text-gray-300 cursor-pointer"
                          >
                            {task.description}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-blue-300 text-sm sm:text-base">Milestone:</h3>
                    <p className={`p-2 rounded text-xs sm:text-sm ${
                      completedTasks[stepIndex]?.length === step.tasks.length 
                        ? 'bg-green-800 text-green-200' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {step.milestone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};