import axios from 'axios'

export interface RealEstateComparable {
  address: string
  price: number
  pricePerSqFt: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  daysOnMarket: number
  saleDate: string
  status: 'sold' | 'listed' | 'pending'
}

export interface MarketData {
  averagePrice: number
  medianPrice: number
  averagePricePerSqFt: number
  comparables: RealEstateComparable[]
  marketTrend: 'up' | 'down' | 'stable'
  inventoryMonths: number
}

// Mock real estate data - in production, integrate with MLS API
const mockMLS = {
  getComparables: async (
    squareFeet: number,
    bedrooms: number,
    zipCode?: string
  ): Promise<RealEstateComparable[]> => {
    const basePrice = 300000
    const pricePerSqFt = 150 + Math.random() * 100
    const comparables: RealEstateComparable[] = []

    for (let i = 0; i < 5; i++) {
      comparables.push({
        address: `${Math.floor(Math.random() * 10000)} ${['Oak', 'Elm', 'Maple', 'Pine'][Math.floor(Math.random() * 4)]} Street`,
        price: Math.floor(basePrice + Math.random() * 200000),
        pricePerSqFt: pricePerSqFt + (Math.random() - 0.5) * 30,
        bedrooms,
        bathrooms: Math.floor(bedrooms / 2) + 1,
        squareFeet: Math.floor(squareFeet * (0.9 + Math.random() * 0.2)),
        daysOnMarket: Math.floor(Math.random() * 180),
        saleDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: (['sold', 'listed', 'pending'] as const)[Math.floor(Math.random() * 3)],
      })
    }

    return comparables
  },

  getMarketData: async (zipCode?: string): Promise<MarketData> => {
    const comparables = await mockMLS.getComparables(2000, 4, zipCode)
    const prices = comparables.map((c) => c.price)
    const pricesPerSqFt = comparables.map((c) => c.pricePerSqFt)

    prices.sort((a, b) => a - b)
    pricesPerSqFt.sort((a, b) => a - b)

    return {
      averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      medianPrice: prices[Math.floor(prices.length / 2)],
      averagePricePerSqFt: pricesPerSqFt.reduce((a, b) => a + b, 0) / pricesPerSqFt.length,
      comparables,
      marketTrend: (['up', 'down', 'stable'] as const)[Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      inventoryMonths: Math.random() * 6 + 2,
    }
  },
}

export async function getRealEstateComparables(
  squareFeet: number,
  bedrooms: number,
  zipCode?: string
): Promise<RealEstateComparable[]> {
  try {
    // For production, connect to MLS API:
    // const response = await axios.get('/api/mls/comparables', {
    //   params: { squareFeet, bedrooms, zipCode }
    // })
    // return response.data

    // Using mock data for development
    return mockMLS.getComparables(squareFeet, bedrooms, zipCode)
  } catch (error) {
    console.error('Failed to fetch real estate data:', error)
    return []
  }
}

export async function getMarketData(zipCode?: string): Promise<MarketData | null> {
  try {
    // For production:
    // const response = await axios.get('/api/mls/market-data', { params: { zipCode } })
    // return response.data

    return mockMLS.getMarketData(zipCode)
  } catch (error) {
    console.error('Failed to fetch market data:', error)
    return null
  }
}

export function calculateEstimatedValue(
  squareFeet: number,
  bedrooms: number,
  pricePerSqFt: number
): number {
  const basePrice = squareFeet * pricePerSqFt
  const bedroomBonus = bedrooms * 20000
  return Math.round(basePrice + bedroomBonus)
}

export interface HousingRecommendation {
  title: string
  description: string
  benefit: string
  priority: 'high' | 'medium' | 'low'
}

export function generateHousingRecommendations(
  blueprint: {
    rooms: number
    squareFeet: number
    style: string
  },
  marketData: MarketData
): HousingRecommendation[] {
  const recommendations: HousingRecommendation[] = []

  // Market trend recommendations
  if (marketData.marketTrend === 'up') {
    recommendations.push({
      title: 'Strong Seller\'s Market',
      description:
        'The current market shows upward trends. This is a good time to build or invest.',
      benefit: 'Potential for appreciation',
      priority: 'high',
    })
  }

  // Size recommendations
  if (blueprint.squareFeet < 1500) {
    recommendations.push({
      title: 'Consider Expansion',
      description: 'Your blueprint is on the smaller side. Expanding 10-15% could increase resale value.',
      benefit: 'Better market appeal',
      priority: 'medium',
    })
  }

  // Bedroom recommendations
  if (blueprint.rooms < 3) {
    recommendations.push({
      title: 'Add Guest Room',
      description: 'Adding one more bedroom is highly marketable in current market conditions.',
      benefit: '5-8% value increase',
      priority: 'medium',
    })
  }

  // Style recommendations
  if (blueprint.style === 'Modern') {
    recommendations.push({
      title: 'Energy Efficiency Focus',
      description: 'Modern homes sell better with emphasis on energy-efficient features.',
      benefit: 'Premium pricing opportunity',
      priority: 'high',
    })
  }

  // Inventory recommendations
  if (marketData.inventoryMonths < 3) {
    recommendations.push({
      title: 'High Demand Area',
      description: 'Low inventory in this market means quick sales potential.',
      benefit: 'Faster sale timeline',
      priority: 'high',
    })
  }

  return recommendations
}
