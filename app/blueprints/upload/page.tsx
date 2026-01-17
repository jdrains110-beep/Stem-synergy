'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function UploadBlueprintPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [blueprintName, setBlueprintName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMessage('Please upload a valid image (JPEG, PNG) or PDF file');
        setFile(null);
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setErrorMessage('');
      
      // Auto-fill name from filename if not set
      if (!blueprintName) {
        const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');
        setBlueprintName(nameWithoutExtension);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      fileInputRef.current!.files = e.dataTransfer.files;
      handleFileChange({ target: { files: e.dataTransfer.files } } as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !blueprintName) {
      setErrorMessage('Please provide a file and blueprint name');
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', blueprintName);
      formData.append('description', description);

      // Upload to API
      const response = await fetch('/api/blueprints/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadStatus('success');
      
      // Redirect to blueprint detail page after success
      setTimeout(() => {
        router.push(`/blueprints/${data.id}`);
      }, 1500);
      
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to upload blueprint. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Stem Synergy
              </span>
            </Link>
            <Link
              href="/blueprints"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              My Blueprints
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Blueprint
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your housing blueprint for AI analysis and 3D visualization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blueprint File
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {file.name}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PNG, JPG or PDF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Blueprint Name */}
          <div className="mb-6">
            <label htmlFor="blueprintName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blueprint Name *
            </label>
            <input
              type="text"
              id="blueprintName"
              value={blueprintName}
              onChange={(e) => setBlueprintName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Modern Villa Blueprint"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Add any additional details about this blueprint..."
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600 dark:text-green-400">
                Blueprint uploaded successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/blueprints"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUploading || !file || !blueprintName}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Blueprint
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
