import React from 'react';

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
}

export const StepGuide: React.FC<StepGuideProps> = ({ steps, completedTasks, onTaskCompletion }) => {
  return (
    <div className="space-y-8">
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