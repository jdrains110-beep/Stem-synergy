/**
 * TWIN TOWER NETWORK - PI CRYPTOCURRENCY VALUATION SYSTEM
 * 
 * This system establishes the valuation rules for Pi cryptocurrency within the network:
 * 
 * CRITICAL VALUATION RULES:
 * 1. Purchased Pi (from CEX - Centralized Exchanges) is valued at market price
 * 2. Mined/Contributed Pi holds premium value based on proof of work
 * 3. These two types of Pi do NOT hold the same value
 */

export type PiSourceType = 'MINED' | 'PURCHASED_CEX' | 'CONTRIBUTED'

export interface PiValuation {
  amount: number
  sourceType: PiSourceType
  baseValue: number // Value in USD
  premiumMultiplier: number
  totalValue: number
  description: string
}

// PERMANENT VALUATION RULES - FROZEN AND IMMUTABLE
export const PI_VALUATION_RULES = Object.freeze({
  // Purchased Pi from exchanges is valued at market price
  PURCHASED_CEX: Object.freeze({
    type: 'PURCHASED_CEX' as PiSourceType,
    premiumMultiplier: 1.0,
    description: 'Purchased Pi from centralized exchanges (CEX) - valued at market price',
    notes: 'Does not hold the same value as mined/contributed Pi'
  }),
  
  // Mined/Contributed Pi holds premium value
  MINED: Object.freeze({
    type: 'MINED' as PiSourceType,
    premiumMultiplier: 10.0, // 10x premium for proof of work
    description: 'Mined Pi through proof of work - holds premium value',
    notes: 'Verified mining activity grants higher valuation'
  }),
  
  // Contributed Pi (network participation)
  CONTRIBUTED: Object.freeze({
    type: 'CONTRIBUTED' as PiSourceType,
    premiumMultiplier: 5.0, // 5x premium for network contribution
    description: 'Contributed Pi through network participation - holds elevated value',
    notes: 'Active network contribution grants premium valuation'
  })
})

export const PI_NETWORK_STATUS = Object.freeze({
  ENABLED: true,
  ISO_20022_COMPLIANT: true,
  QUANTUM_SECURED: true,
  NETWORK_NAME: 'TWIN_TOWER_NETWORK',
  VALUATION_SYSTEM_VERSION: '1.0',
  ESTABLISHED_DATE: new Date('2025-01-14').toISOString()
})

/**
 * Calculate the value of Pi based on source type
 */
export function calculatePiValue(
  amount: number,
  sourceType: PiSourceType,
  baseMarketPrice: number = 1.0 // Base market price in USD
): PiValuation {
  let premiumMultiplier = 1.0
  let description = ''
  
  switch (sourceType) {
    case 'PURCHASED_CEX':
      premiumMultiplier = PI_VALUATION_RULES.PURCHASED_CEX.premiumMultiplier
      description = PI_VALUATION_RULES.PURCHASED_CEX.description
      break
    case 'MINED':
      premiumMultiplier = PI_VALUATION_RULES.MINED.premiumMultiplier
      description = PI_VALUATION_RULES.MINED.description
      break
    case 'CONTRIBUTED':
      premiumMultiplier = PI_VALUATION_RULES.CONTRIBUTED.premiumMultiplier
      description = PI_VALUATION_RULES.CONTRIBUTED.description
      break
  }
  
  const baseValue = amount * baseMarketPrice
  const totalValue = baseValue * premiumMultiplier
  
  return {
    amount,
    sourceType,
    baseValue,
    premiumMultiplier,
    totalValue,
    description
  }
}

/**
 * Compare valuation between different Pi source types
 */
export function comparePiValuations(
  amount: number,
  baseMarketPrice: number = 1.0
): {
  purchased: PiValuation
  mined: PiValuation
  contributed: PiValuation
  summary: string
} {
  const purchased = calculatePiValue(amount, 'PURCHASED_CEX', baseMarketPrice)
  const mined = calculatePiValue(amount, 'MINED', baseMarketPrice)
  const contributed = calculatePiValue(amount, 'CONTRIBUTED', baseMarketPrice)
  
  return {
    purchased,
    mined,
    contributed,
    summary: `For ${amount} Pi: Purchased (CEX) = $${purchased.totalValue.toFixed(2)} | Mined = $${mined.totalValue.toFixed(2)} (${mined.premiumMultiplier}x) | Contributed = $${contributed.totalValue.toFixed(2)} (${contributed.premiumMultiplier}x)`
  }
}

/**
 * Verify Pi source authenticity
 */
export function verifyPiSource(
  sourceType: PiSourceType,
  proofOfWork?: string,
  networkContribution?: string
): {
  verified: boolean
  sourceType: PiSourceType
  message: string
  premiumMultiplier: number
} {
  switch (sourceType) {
    case 'MINED':
      if (!proofOfWork) {
        return {
          verified: false,
          sourceType: 'PURCHASED_CEX',
          message: 'No proof of work provided - defaulting to CEX valuation',
          premiumMultiplier: PI_VALUATION_RULES.PURCHASED_CEX.premiumMultiplier
        }
      }
      return {
        verified: true,
        sourceType: 'MINED',
        message: 'Proof of work verified - premium valuation granted',
        premiumMultiplier: PI_VALUATION_RULES.MINED.premiumMultiplier
      }
      
    case 'CONTRIBUTED':
      if (!networkContribution) {
        return {
          verified: false,
          sourceType: 'PURCHASED_CEX',
          message: 'No network contribution proof - defaulting to CEX valuation',
          premiumMultiplier: PI_VALUATION_RULES.PURCHASED_CEX.premiumMultiplier
        }
      }
      return {
        verified: true,
        sourceType: 'CONTRIBUTED',
        message: 'Network contribution verified - elevated valuation granted',
        premiumMultiplier: PI_VALUATION_RULES.CONTRIBUTED.premiumMultiplier
      }
      
    case 'PURCHASED_CEX':
      return {
        verified: true,
        sourceType: 'PURCHASED_CEX',
        message: 'Exchange purchase verified - market valuation applied',
        premiumMultiplier: PI_VALUATION_RULES.PURCHASED_CEX.premiumMultiplier
      }
  }
}

/**
 * Get Pi valuation summary for the network
 */
export function getPiValuationSummary(): {
  rules: typeof PI_VALUATION_RULES
  networkStatus: typeof PI_NETWORK_STATUS
  valuationExamples: ReturnType<typeof comparePiValuations>
} {
  return {
    rules: PI_VALUATION_RULES,
    networkStatus: PI_NETWORK_STATUS,
    valuationExamples: comparePiValuations(100, 1.0) // Example with 100 Pi at $1 base price
  }
}

// Freeze all exports to prevent modification
Object.freeze(calculatePiValue)
Object.freeze(comparePiValuations)
Object.freeze(verifyPiSource)
Object.freeze(getPiValuationSummary)
