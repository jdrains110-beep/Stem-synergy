'use client';

import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnalysisData {
  dimensions: {
    length: string;
    width: string;
    height: string;
    area: string;
  };
  rooms: string[];
  features: string[];
  recommendations: string[];
}

export default function ClaudeAnalysis({ analysis }: { analysis: AnalysisData }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Claude Vision AI Analysis</h2>
        </div>
        <p className="text-indigo-100">
          Advanced AI-powered insights from your housing blueprint
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Blueprint Dimensions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Length</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.dimensions.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Width</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.dimensions.width}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysis.dimensions.height}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Area</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {analysis.dimensions.area}
              </p>
            </div>
          </div>
        </div>

        {/* Room Count Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Room Analysis
          </h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                {analysis.rooms.length}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Total Rooms Identified</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {analysis.rooms.slice(0, 3).map((room, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                >
                  {room.split(' ')[0]}
                </span>
              ))}
              {analysis.rooms.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                  +{analysis.rooms.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Room List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Detailed Room Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.rooms.map((room, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="h-2 w-2 bg-indigo-600 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{room}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Identified */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Key Features Identified
        </h3>
        <ul className="space-y-3">
          {analysis.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
              </span>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          AI-Powered Recommendations
        </h3>
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
            >
              <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Info */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
        <p className="text-sm text-indigo-800 dark:text-indigo-200">
          <strong>Note:</strong> This analysis was generated using Claude Vision AI. The AI has analyzed
          your blueprint image to extract dimensions, identify rooms, detect features, and provide
          recommendations. For production use, integrate with the Anthropic Claude API.
        </p>
      </div>
    </div>
  );
}
