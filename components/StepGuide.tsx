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

  const calculateProgress = () => {
    const completedTaskCount = Object.values(completedTasks).flat().length;
    return (completedTaskCount / totalTasks) * 100;
  };

  useEffect(() => {
    const targetProgress = calculateProgress();
    const animationDuration = 1000; // 1 second
    const stepSize = 1;
    const stepDuration = animationDuration / (targetProgress / stepSize);

    const animateProgress = () => {
      setProgress(prevProgress => {
        if (prevProgress < targetProgress) {
          setTimeout(animateProgress, stepDuration);
          return Math.min(prevProgress + stepSize, targetProgress);
        }
        return prevProgress;
      });
    };

    animateProgress();
  }, [completedTasks, totalTasks]);

  return (
    <div className="space-y-8">
      <div className="relative w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="absolute top-0 left-0 bg-blue-600 h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700">{`${Math.round(progress)}%`}</span>
        </div>
      </div>
      {steps.map((step, stepIndex) => (
        <div key={stepIndex} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{step.title}</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Tasks:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {step.tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`task-${stepIndex}-${taskIndex}`}
                    checked={completedTasks[stepIndex]?.includes(taskIndex)}
                    onChange={() => onTaskCompletion(stepIndex, taskIndex)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`task-${stepIndex}-${taskIndex}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {task.description}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Milestone:</h3>
            <p className={`p-2 rounded text-sm ${
              completedTasks[stepIndex]?.length === step.tasks.length 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {step.milestone}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};