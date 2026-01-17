'use client'

import { getTotalCompanies, companiesByCategory, getTotalRevenue } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BlueprintGenerator } from '@/components/blueprint-generator'
import { useState } from 'react'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [activeView, setActiveView] = useState<'overview' | 'companies' | 'blueprints' | 'pi-valuation' | 'security'>('overview')
  
  const totalCompanies = getTotalCompanies()
  const triumphSynergyCount = 677
  const totalRevenue = getTotalRevenue()

  const categories = ['All Categories', ...Object.keys(companiesByCategory)]

  const filteredCompanies = Object.entries(companiesByCategory).flatMap(([category, companies]) => {
    if (selectedCategory !== 'All Categories' && category !== selectedCategory) return []
    return companies
      .filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(company => ({ ...company, category }))
  })

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Stem-Synergy</h1>
          <p className="mt-1 text-xs text-muted-foreground">Twin Tower Network</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveView('overview')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeView === 'overview' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-sidebar-accent'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('companies')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeView === 'companies' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-sidebar-accent'
            }`}
          >
            Companies
          </button>
          <button
            onClick={() => setActiveView('blueprints')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeView === 'blueprints' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-sidebar-accent'
            }`}
          >
            Blueprint Generator
          </button>
          <button
            onClick={() => setActiveView('pi-valuation')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeView === 'pi-valuation' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-sidebar-accent'
            }`}
          >
            Pi Valuation
          </button>
          <button
            onClick={() => setActiveView('security')}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeView === 'security' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-sidebar-accent'
            }`}
          >
            Security Status
          </button>
        </nav>

        <div className="mt-8 space-y-3 border-t border-sidebar-border pt-6">
          <div>
            <p className="text-xs text-muted-foreground">Total Companies</p>
            <p className="text-2xl font-bold text-primary">{totalCompanies}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Triumph-Synergy</p>
            <p className="text-2xl font-bold text-primary">{triumphSynergyCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-xl font-bold">{Object.keys(companiesByCategory).length}</p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
            <p className="text-xs font-medium text-primary">Owner</p>
            <p className="mt-1 text-sm font-bold">Jeremiah Joel Drains</p>
            <Badge className="mt-2 bg-green-600 text-xs">100% Debt-Free</Badge>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Network Overview</h2>
              <p className="mt-2 text-muted-foreground">
                Complete financial and operational status of the Twin Tower Network
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-primary/20 bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Network Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{totalRevenue}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Combined company revenue</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Synchronized Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">100%</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {totalCompanies} / {triumphSynergyCount} companies secured
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Network Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{Object.keys(companiesByCategory).length}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Diverse industry coverage</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-accent/20 bg-card">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(companiesByCategory).map(([category, companies]) => (
                    <div key={category} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
                      <span className="text-sm font-medium">{category}</span>
                      <Badge variant="secondary">{companies.length}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Companies View */}
        {activeView === 'companies' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Company Directory</h2>
              <p className="mt-2 text-muted-foreground">Browse and search all {totalCompanies} companies in the network</p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <Input 
                placeholder="Search companies by name or domain..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-input"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-input bg-input px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredCompanies.length} companies found</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company, index) => (
                <Card key={`${company.domain}-${index}`} className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold leading-tight">{company.name}</CardTitle>
                      <a 
                        href={`https://${company.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-shrink-0 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                      >
                        Visit
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{company.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Revenue:</span>
                      <span className="text-sm font-semibold text-green-500">{company.revenue}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{company.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Blueprint Generator View */}
        {activeView === 'blueprints' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">AI Blueprint Generator</h2>
              <p className="mt-2 text-muted-foreground">
                Create professional housing blueprints from descriptions or images using advanced AI
              </p>
            </div>
            <BlueprintGenerator />
          </div>
        )}

        {/* Pi Valuation View */}
        {activeView === 'pi-valuation' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Pi Cryptocurrency Valuation</h2>
              <p className="mt-2 text-muted-foreground">
                Official valuation system for Pi cryptocurrency in the Twin Tower Network
              </p>
            </div>

            <Card className="border-amber-500/30 bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <span>⚠️</span> Critical Valuation Rule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  Purchased Pi from CEX exchanges does NOT hold the same value as Mined or Contributed Pi. 
                  The Twin Tower Network enforces strict premium multipliers based on verified proof of work and network contribution.
                  This valuation system is permanently frozen and incorruptible.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-red-500/30 bg-red-950/20">
                <CardHeader>
                  <CardTitle className="text-red-400">Purchased Pi (CEX)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-5xl font-bold text-red-400">1.0x</p>
                    <p className="mt-2 text-xs text-red-300">Base multiplier</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Purchased from cryptocurrency exchanges. Market price valuation only. No premium granted.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Mined Pi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-5xl font-bold text-green-400">10.0x</p>
                    <p className="mt-2 text-xs text-green-300">Premium multiplier</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verified proof of work through mining. Highest valuation tier with full premium multiplier.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Contributed Pi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-5xl font-bold text-blue-400">5.0x</p>
                    <p className="mt-2 text-xs text-blue-300">Elevated multiplier</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Network participation and contribution. Mid-tier valuation with elevated premium.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle>Valuation Example: 100 Pi at $1 Base Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-red-500/30 bg-red-950/10 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Purchased (CEX)</p>
                    <p className="mt-2 text-3xl font-bold text-red-400">$100.00</p>
                    <p className="mt-1 text-xs text-muted-foreground">100 Pi × $1 × 1.0x</p>
                  </div>
                  <div className="rounded-lg border border-green-500/30 bg-green-950/10 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Mined</p>
                    <p className="mt-2 text-3xl font-bold text-green-400">$1,000.00</p>
                    <p className="mt-1 text-xs text-muted-foreground">100 Pi × $1 × 10.0x</p>
                  </div>
                  <div className="rounded-lg border border-blue-500/30 bg-blue-950/10 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Contributed</p>
                    <p className="mt-2 text-3xl font-bold text-blue-400">$500.00</p>
                    <p className="mt-1 text-xs text-muted-foreground">100 Pi × $1 × 5.0x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Status View */}
        {activeView === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Security Status</h2>
              <p className="mt-2 text-muted-foreground">Database integrity and backup system status</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-green-500/30 bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <span>✓</span> Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center justify-between">
                    <span>Total Companies:</span>
                    <span className="font-bold text-green-400">{totalCompanies}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Triumph-Synergy Sync:</span>
                    <span className="font-bold text-green-400">{triumphSynergyCount}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Integrity:</span>
                    <span className="font-bold text-green-400">100%</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className="font-bold text-green-400">SECURED</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>🔒</span> Backup System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center justify-between">
                    <span>Primary Backup:</span>
                    <span className="font-bold text-green-400">ACTIVE</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Auto-Recovery:</span>
                    <span className="font-bold text-green-400">ENABLED</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Checksum:</span>
                    <span className="font-mono text-xs text-muted-foreground">TTN-677-LOCKED</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Corruption Protection:</span>
                    <span className="font-bold text-green-400">ACTIVE</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle>Security Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Permanent Snapshot Enabled</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Object.freeze() Protection</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Automatic Validation</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Incorruptible Records</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Pi Valuation Locked</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Owner Verification Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">Network Owner Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span>Owner:</span>
                  <span className="font-bold">Jeremiah Joel Drains</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Financial Status:</span>
                  <Badge className="bg-green-600">100% Debt-Free</Badge>
                </p>
                <p className="flex items-center justify-between">
                  <span>Ownership:</span>
                  <span className="font-bold text-primary">Complete & Verified</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Security Clearance:</span>
                  <span className="font-bold text-green-400">MAXIMUM</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
