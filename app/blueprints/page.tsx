'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Search, Grid, List } from 'lucide-react';

interface Blueprint {
  id: string;
  name: string;
  uploadDate: string;
  status: 'analyzing' | 'complete' | 'error';
  thumbnail: string;
  description?: string;
}

export default function BlueprintsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in production, this would come from an API
  const [blueprints] = useState<Blueprint[]>([
    {
      id: '1',
      name: 'Modern Villa Blueprint',
      uploadDate: '2026-01-15',
      status: 'complete',
      thumbnail: '/api/placeholder/400/300',
      description: '3-bedroom modern villa with open floor plan',
    },
    {
      id: '2',
      name: 'Urban Apartment Complex',
      uploadDate: '2026-01-14',
      status: 'complete',
      thumbnail: '/api/placeholder/400/300',
      description: '12-unit apartment building with retail space',
    },
    {
      id: '3',
      name: 'Suburban Home',
      uploadDate: '2026-01-12',
      status: 'analyzing',
      thumbnail: '/api/placeholder/400/300',
      description: 'Single-family home with garage',
    },
  ]);

  const filteredBlueprints = blueprints.filter((bp) =>
    bp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="flex space-x-4">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Blueprints
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and view all your housing blueprints
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blueprints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Blueprints Grid/List */}
        {filteredBlueprints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No blueprints found. Upload your first blueprint to get started!
            </p>
            <Link
              href="/blueprints/upload"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Upload Blueprint
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlueprints.map((blueprint) => (
              <Link
                key={blueprint.id}
                href={`/blueprints/${blueprint.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {blueprint.name}
                  </h3>
                  {blueprint.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {blueprint.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {blueprint.uploadDate}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        blueprint.status === 'complete'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : blueprint.status === 'analyzing'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {blueprint.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBlueprints.map((blueprint) => (
              <Link
                key={blueprint.id}
                href={`/blueprints/${blueprint.id}`}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {blueprint.name}
                  </h3>
                  {blueprint.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {blueprint.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {blueprint.uploadDate}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      blueprint.status === 'complete'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : blueprint.status === 'analyzing'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {blueprint.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
