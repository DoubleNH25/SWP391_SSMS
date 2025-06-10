import { useState, useRef } from 'react';
import { Modal } from './modal';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add('border-blue-500', 'border-2');
    }
  };

  const handleDragLeave = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-blue-500', 'border-2');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove('border-blue-500', 'border-2');
    }
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleUpload = () => {
    if (files.length > 0) {
      const lastFile = files[files.length - 1];
      onUpload([lastFile]);
      setFiles([]);
      onClose();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      isFullscreen={false}
      className="max-w-md"
    >
      <div className="p-6">
        <h1 className="text-center text-2xl font-semibold mb-4 text-gray-800">
          File Drop and Upload
        </h1>
        <div
          ref={dropzoneRef}
          className="bg-gray-100 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span className="text-gray-600">Drag and drop your files here</span>
            <span className="text-gray-500 text-sm">(or click to select)</span>
          </label>
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileInputChange}
          />
        </div>
        <div className="mt-6 text-center" id="fileList">
          {files.map((file, index) => (
            <div key={index} className="text-sm text-gray-600 mb-2">
              {file.name} ({formatBytes(file.size)})
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>
      </div>
    </Modal>
  );
}; 