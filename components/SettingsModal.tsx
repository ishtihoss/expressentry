// components/SettingsModal.tsx
interface SettingsModalProps {
    show: boolean;
    matchCount: number;
    apiKey: string;
    onMatchCountChange: (value: number) => void;
    onApiKeyChange: (value: string) => void;
    onSave: () => void;
    onClear: () => void;
  }
  
  export const SettingsModal: React.FC<SettingsModalProps> = ({
    show,
    matchCount,
    apiKey,
    onMatchCountChange,
    onApiKeyChange,
    onSave,
    onClear,
  }) => {
    if (!show) {
      return null;
    }
  
    return (
      <div className="fixed bottom-4 right-4">
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="mb-4">
            <label htmlFor="matchCount" className="block text-gray-700 font-bold mb-2">
              Passage Count
            </label>
            <input
              type="number"
              id="matchCount"
              min={1}
              max={10}
              value={matchCount}
              onChange={(e) => onMatchCountChange(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-gray-700 font-bold mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="apiKey"
              placeholder="OpenAI API Key"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="flex justify-end space-x-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={onSave}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={onClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  };