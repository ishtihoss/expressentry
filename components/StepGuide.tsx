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
    <div className="font-pixel bg-green-800 p-6 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-800 p-4 rounded-lg shadow-inner mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-lg">Progress</span>
          <span className="text-yellow-300 text-lg">{Math.round(progress)}%</span>
        </div>
        <div className="bg-gray-600 h-8 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="relative">
        {/* Start flag */}
        <div className="absolute top-0 left-0 w-8 h-16 bg-red-600 border-2 border-white z-10" />
        <div className="absolute top-16 left-0 w-8 h-8 bg-white border-2 border-red-600 z-10" />
        <div className="absolute top-0 left-8 w-2 h-24 bg-gray-800 z-10" />

        {/* Finish flag */}
        <div className="absolute bottom-0 right-0 w-8 h-16 bg-black border-2 border-white z-10 
                        bg-checkerboard-white-black" />
        <div className="absolute bottom-16 right-0 w-8 h-8 bg-white border-2 border-black z-10" />
        <div className="absolute bottom-0 right-8 w-2 h-24 bg-gray-800 z-10" />

        {/* Road */}
        <div className="absolute top-12 left-4 right-4 bottom-12 
                        bg-gradient-to-br from-gray-600 to-gray-700
                        border-4 border-yellow-400" />

        {/* Steps */}
        <div className="relative z-20 py-12 px-8">
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} 
                 className={`flex mb-16 ${stepIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center 
                               border-4 ${completedTasks[stepIndex]?.length === step.tasks.length 
                                 ? 'bg-green-500 border-yellow-400' 
                                 : 'bg-gray-700 border-gray-500'}`}>
                <span className="text-2xl font-bold text-white">{stepIndex + 1}</span>
              </div>
              <div className={`flex-1 ${stepIndex % 2 === 0 ? 'ml-8' : 'mr-8'}`}>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
                  <h2 className="text-xl font-semibold mb-2 text-yellow-300">{step.title}</h2>
                  <div className="mb-2">
                    <h3 className="font-medium mb-1 text-blue-300">Tasks:</h3>
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
                            className="text-sm text-gray-300 cursor-pointer"
                          >
                            {task.description}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-blue-300">Milestone:</h3>
                    <p className={`p-2 rounded text-sm ${
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