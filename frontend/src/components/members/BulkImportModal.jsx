import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNotification } from '../../context/NotificationContext';
import { UploadCloud, CheckCircle, FileUp } from 'lucide-react';

export function BulkImportModal({ isOpen, onClose, onImport }) {
  const notify = useNotification();
  const [parsedData, setParsedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            notify.error('Error parsing CSV file');
            console.error(results.errors);
          } else {
            setParsedData(results.data);
            notify.success(`Parsed ${results.data.length} records successfully.`);
          }
        },
      });
    }
  }, [notify]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleImport = async () => {
    if (!parsedData.length) return;
    setIsProcessing(true);
    try {
      await onImport(parsedData);
      setParsedData([]);
      onClose();
    } catch (e) {
      // notify.error inside onImport
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Bulk Import Members</h2>
          <p className="text-sm text-gray-500 mt-1">Upload a CSV file containing members. Columns expected: Name, Phone, Email, Zone, Programs.</p>
        </div>

        {!parsedData.length ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">Drag & drop your CSV here</p>
            <p className="text-sm text-gray-500 mt-1">or click to browse from your computer</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-green-900 text-lg">Ready to Import</h3>
            <p className="text-green-700 mt-1">{parsedData.length} member records found and validated.</p>
          </div>
        )}

        <div className="mt-8 flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={() => { setParsedData([]); onClose(); }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleImport}
            disabled={!parsedData.length || isProcessing}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? 'Importing...' : <><FileUp className="w-4 h-4" /> Start Import</>}
          </button>
        </div>
      </div>
    </div>
  );
}
