/**
 * Satellite Route API
 * Provides route optimization and tariff calculation
 * Real-time satellite tracking and Starlink coverage
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateOptimizedRoute,
  checkStarlinkCoverage,
  getRecommendedNetwork,
  getGlobalTariffRates,
  trackSatelliteConstellation,
  STARLINK_TLE_SAMPLE
} from '@/lib/satellite-routing';

export async function POST(request: NextRequest) {
  try {
    console.log('[Route API] Calculating optimized route...');
    
    const body = await request.json();
    const { origin, destination } = body;
    
    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination required' },
        { status: 400 }
      );
    }
    
    // Track satellites along potential route
    const satellites = await trackSatelliteConstellation(STARLINK_TLE_SAMPLE);
    const validSatellites = satellites
      .filter(sat => sat.position !== null)
      .map(sat => sat.position!);
    
    // Calculate optimized route
    const route = calculateOptimizedRoute(origin, destination, validSatellites);
    
    // Check Starlink coverage at both endpoints
    const originCoverage = await checkStarlinkCoverage(origin.lat, origin.lng);
    const destCoverage = await checkStarlinkCoverage(destination.lat, destination.lng);
    
    // Get recommended networks
    const originNetwork = await getRecommendedNetwork(origin.lat, origin.lng);
    const destNetwork = await getRecommendedNetwork(destination.lat, destination.lng);
    
    return NextResponse.json({
      success: true,
      route,
      coverage: {
        origin: {
          starlink: originCoverage,
          recommended: originNetwork
        },
        destination: {
          starlink: destCoverage,
          recommended: destNetwork
        }
      },
      satellites: satellites.length,
      activeSatellites: validSatellites.length
    });
    
  } catch (error) {
    console.error('[Route API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Route calculation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const region = (searchParams.get('region') || 'NA') as any;
    
    // Get coverage and tariff info for location
    const starlinkCoverage = await checkStarlinkCoverage(lat, lng);
    const recommendedNetwork = await getRecommendedNetwork(lat, lng);
    const tariffRates = getGlobalTariffRates(region);
    
    // Track visible satellites
    const satellites = await trackSatelliteConstellation(STARLINK_TLE_SAMPLE);
    
    return NextResponse.json({
      location: { lat, lng },
      coverage: {
        starlink: starlinkCoverage,
        recommended: recommendedNetwork
      },
      tariff: tariffRates,
      satellites: {
        total: satellites.length,
        visible: satellites.filter(s => s.position !== null).length
      }
    });
    
  } catch (error) {
    console.error('[Route API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get route info' },
      { status: 500 }
    );
  }
}
