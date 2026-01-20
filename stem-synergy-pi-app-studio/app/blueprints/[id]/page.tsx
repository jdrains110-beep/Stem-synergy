'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { Home, Download, Share2, Eye, Sparkles, Maximize2 } from 'lucide-react';
import Blueprint3DViewer from '@/components/Blueprint3DViewer';
import ClaudeAnalysis from '@/components/ClaudeAnalysis';

interface Blueprint {
  id: string;
  name: string;
  description?: string;
  uploadDate: string;
  status: 'analyzing' | 'complete' | 'error';
  fileUrl?: string;
  analysis?: {
    dimensions: {
      length: string;
      width: string;
      height: string;
      area: string;
    };
    rooms: string[];
    features: string[];
    recommendations: string[];
  };
}

export default function BlueprintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'3d' | 'analysis' | 'details'>('3d');

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockBlueprint: Blueprint = {
      id: id,
      name: 'Modern Villa Blueprint',
      description: '3-bedroom modern villa with open floor plan',
      uploadDate: '2026-01-15',
      status: 'complete',
      fileUrl: '/mock-blueprint.jpg',
      analysis: {
        dimensions: {
          length: '15.5m',
          width: '12.3m',
          height: '3.2m',
          area: '190.65 m²',
        },
        rooms: [
          'Master Bedroom (18 m²)',
          'Bedroom 2 (14 m²)',
          'Bedroom 3 (12 m²)',
          'Living Room (35 m²)',
          'Kitchen (20 m²)',
          'Dining Room (18 m²)',
          'Bathroom 1 (8 m²)',
          'Bathroom 2 (6 m²)',
          'Garage (40 m²)',
        ],
        features: [
          'Open concept living and dining area',
          'Large windows for natural light',
          'Master bedroom with en-suite bathroom',
          'Modern kitchen with island',
          'Two-car garage',
          'Outdoor patio area',
        ],
        recommendations: [
          'Consider adding solar panels on the roof',
          'Energy-efficient windows recommended',
          'Smart home integration opportunities',
          'Sustainable building materials suggested',
        ],
      },
    };

    setTimeout(() => {
      setBlueprint(mockBlueprint);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading blueprint...</p>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Blueprint not found</p>
          <Link href="/blueprints" className="text-indigo-600 hover:text-indigo-700">
            Return to Blueprints
          </Link>
        </div>
      </div>
    );
  }

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
                href="/blueprints"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                My Blueprints
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {blueprint.name}
              </h1>
              {blueprint.description && (
                <p className="text-gray-600 dark:text-gray-300">{blueprint.description}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Uploaded on {blueprint.uploadDate}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white dark:bg-gray-800 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-700">
                <Share2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full ${
              blueprint.status === 'complete'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : blueprint.status === 'analyzing'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {blueprint.status === 'complete' ? 'Analysis Complete' : blueprint.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('3d')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === '3d'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Maximize2 className="h-4 w-4" />
                3D View
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'analysis'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Analysis
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'details'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Eye className="h-4 w-4" />
                Details
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === '3d' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Blueprint3DViewer blueprintId={blueprint.id} />
          </div>
        )}

        {activeTab === 'analysis' && blueprint.analysis && (
          <ClaudeAnalysis analysis={blueprint.analysis} />
        )}

        {activeTab === 'details' && blueprint.analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dimensions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Dimensions
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Length:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blueprint.analysis.dimensions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Width:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blueprint.analysis.dimensions.width}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Height:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blueprint.analysis.dimensions.height}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Total Area:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {blueprint.analysis.dimensions.area}
                  </span>
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Rooms
              </h2>
              <ul className="space-y-2">
                {blueprint.analysis.rooms.map((room, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <span className="h-2 w-2 bg-indigo-600 rounded-full mr-3"></span>
                    {room}
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Features
              </h2>
              <ul className="space-y-2">
                {blueprint.analysis.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-indigo-600 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recommendations
              </h2>
              <ul className="space-y-2">
                {blueprint.analysis.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-700 dark:text-gray-300"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
