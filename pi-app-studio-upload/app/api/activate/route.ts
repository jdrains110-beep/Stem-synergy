/**
 * Superior Smart Activation API
 * Handles Pi Network + Stellar dual-chain activation
 * Validates satellite connectivity and manages automatic upgrades
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  processSmartActivation,
  createStellarKeypair,
  getDualChainBalance
} from '@/lib/stellar-integration';
import {
  checkStarlinkCoverage,
  getRecommendedNetwork,
  calculateOptimizedRoute
} from '@/lib/satellite-routing';
import {
  checkForUpgrades,
  getDeploymentStatus,
  performAutoUpgrade,
  getSystemVersion
} from '@/lib/auto-upgrade';

export interface ActivationRequest {
  piUsername: string;
  stellarPublicKey?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  autoUpgrade?: boolean;
}

export interface ActivationResponse {
  success: boolean;
  activation: {
    piUsername: string;
    stellarAccount: {
      publicKey: string;
      activated: boolean;
    };
    satellite: {
      starlinkAvailable: boolean;
      recommendedNetwork: string;
      coverage: number;
    };
    upgrade: {
      version: string;
      features: string[];
      autoUpgraded: boolean;
    };
    balance: {
      pi: number;
      stellar: string;
    };
  };
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Activate API] Processing superior smart activation...');
    
    const body: ActivationRequest = await request.json();
    const { piUsername, stellarPublicKey, location, autoUpgrade = true } = body;
    
    if (!piUsername) {
      return NextResponse.json(
        { error: 'Pi username required' },
        { status: 400 }
      );
    }
    
    // Step 1: Create or validate Stellar account
    let stellarKey = stellarPublicKey;
    if (!stellarKey) {
      console.log('[Activate] Creating new Stellar keypair...');
      const keypair = createStellarKeypair();
      stellarKey = keypair.publicKey;
      // Note: In production, store secretKey securely for user
    }
    
    // Step 2: Process smart activation with Stellar SCP
    console.log('[Activate] Processing Stellar activation...');
    const smartUpgrade = await processSmartActivation(piUsername, stellarKey);
    
    // Step 3: Check satellite connectivity
    let satelliteInfo = {
      starlinkAvailable: false,
      recommendedNetwork: 'Default',
      coverage: 0
    };
    
    if (location) {
      console.log('[Activate] Checking satellite coverage...');
      const starlinkCoverage = await checkStarlinkCoverage(
        location.latitude,
        location.longitude
      );
      const recommendedNetwork = await getRecommendedNetwork(
        location.latitude,
        location.longitude
      );
      
      satelliteInfo = {
        starlinkAvailable: starlinkCoverage.available,
        recommendedNetwork: recommendedNetwork.primary,
        coverage: recommendedNetwork.coverage
      };
    }
    
    // Step 4: Check for system upgrades
    let upgradeInfo = getSystemVersion();
    if (autoUpgrade) {
      console.log('[Activate] Checking for automatic upgrades...');
      const upgradeCheck = await checkForUpgrades();
      
      if (upgradeCheck.updateAvailable) {
        console.log('[Activate] Performing auto-upgrade...');
        await performAutoUpgrade(upgradeCheck.latestVersion);
      }
    }
    
    // Step 5: Get dual-chain balance
    const balance = await getDualChainBalance(10, stellarKey); // Default 10 Pi credits
    
    // Build response
    const response: ActivationResponse = {
      success: true,
      activation: {
        piUsername,
        stellarAccount: {
          publicKey: stellarKey,
          activated: smartUpgrade.activated
        },
        satellite: satelliteInfo,
        upgrade: {
          version: upgradeInfo.version,
          features: upgradeInfo.features,
          autoUpgraded: autoUpgrade
        },
        balance: {
          pi: balance.pi,
          stellar: balance.stellar
        }
      },
      message: 'Superior smart activation complete! Platform powered by Pi Network + Stellar SCP with satellite connectivity.'
    };
    
    console.log('[Activate API] Success:', response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[Activate API] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Activation failed',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return system status and capabilities
    const systemVersion = getSystemVersion();
    const deploymentStatus = await getDeploymentStatus();
    const upgradeInfo = await checkForUpgrades();
    
    return NextResponse.json({
      status: 'operational',
      version: systemVersion.version,
      features: systemVersion.features,
      deployment: deploymentStatus,
      upgrades: {
        current: upgradeInfo.currentVersion,
        latest: upgradeInfo.latestVersion,
        available: upgradeInfo.updateAvailable
      },
      capabilities: {
        piNetwork: true,
        stellarSCP: true,
        satelliteRouting: true,
        starlinkSupport: true,
        autoUpgrade: true,
        dualChain: true
      }
    });
  } catch (error) {
    console.error('[Activate API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get system status' },
      { status: 500 }
    );
  }
}
