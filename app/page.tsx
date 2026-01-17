import Link from 'next/link';
import { Upload, Eye, Home, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Stem Synergy
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/blueprints"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                My Blueprints
              </Link>
              <Link
                href="/blueprints/upload"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Upload Blueprint
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl">
            AI-Powered Housing
            <span className="text-indigo-600"> Blueprint Platform</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your housing blueprints with Claude Vision AI, stunning 3D visualizations,
            and seamless real estate integration.
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/blueprints/upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Blueprint
            </Link>
            <Link
              href="/blueprints"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Eye className="mr-2 h-5 w-5" />
              View Blueprints
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white text-center">
              Claude Vision AI
            </h3>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300 text-center">
              Advanced AI analysis of your blueprints using Claude&apos;s vision capabilities for intelligent insights.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white text-center">
              3D Visualization
            </h3>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300 text-center">
              Interactive 3D models of your housing blueprints with immersive viewing experiences.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
              <Home className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white text-center">
              Real Estate Integration
            </h3>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300 text-center">
              Seamlessly connect your blueprints with real estate platforms and property data.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                  1
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Your Blueprint</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Upload images or PDFs of your housing blueprints to our secure platform.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                  2
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Analysis</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Claude Vision AI analyzes your blueprints, extracting dimensions, features, and key details.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                  3
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">3D Visualization</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  View your blueprint as an interactive 3D model with real-time rendering.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                  4
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Share & Integrate</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Export your analyzed blueprints or integrate with real estate platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2026 Stem Synergy. AI-powered housing blueprint platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
