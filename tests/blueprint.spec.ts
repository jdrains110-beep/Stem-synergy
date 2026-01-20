import { test, expect } from '@playwright/test'

test.describe('Blueprint Generator', () => {
  test.beforeEach(async ({ page }) => {
    // Inject Pi SDK mock before navigating to prevent auth errors in CI
    await page.addInitScript(() => {
      // Mock Pi SDK for testing
      (window as any).Pi = {
        init: async () => {
          console.log('[Mock Pi] init called');
          return Promise.resolve();
        },
        authenticate: async () => {
          console.log('[Mock Pi] authenticate called');
          return {
            accessToken: 'mock-token-for-testing',
            user: {
              uid: 'test-uid',
              username: 'test_user',
            },
          };
        },
        createPayment: () => {
          console.log('[Mock Pi] createPayment called');
        },
      };
    });

    // Mock the backend login API
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user-id',
          username: 'test_user',
          credits_balance: 100,
          terms_accepted: true,
        }),
      });
    });

    await page.goto('http://localhost:3000')
    
    // Wait for authentication to complete (or timeout)
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('Page load timeout - continuing anyway');
    });
  })

  test('should navigate to blueprint generator', async ({ page }) => {
    await page.click('button:has-text("Blueprint Generator")')
    await expect(page).toHaveTitle(/Stem Synergy/)
    await expect(page.locator('text=AI Blueprint Generator')).toBeVisible()
  })

  test('should generate blueprint from description', async ({ page }) => {
    // Navigate to blueprint section
    await page.click('button:has-text("Blueprint Generator")')

    // Fill in project name
    await page.fill('input[placeholder*="Project Name"]', 'Test Home')

    // Fill in description
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 4-bedroom, 2-bath modern home with open kitchen'
    )

    // Click generate button
    await page.click('button:has-text("Generate Blueprint")')

    // Wait for generation to complete
    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })

    // Verify blueprint details are displayed
    await expect(page.locator('text=4')).toBeVisible() // Rooms
    await expect(page.locator('text=Modern')).toBeVisible() // Style
  })

  test('should download blueprint as SVG', async ({ page, context }) => {
    await page.click('button:has-text("Blueprint Generator")')
    await page.fill('input[placeholder*="Project Name"]', 'Test Home')
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 3-bedroom home'
    )
    await page.click('button:has-text("Generate Blueprint")')

    // Wait for preview
    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })

    // Intercept download
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Download SVG")')
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain('blueprint.svg')
  })

  test('should save blueprint to gallery', async ({ page }) => {
    await page.click('button:has-text("Blueprint Generator")')
    await page.fill('input[placeholder*="Project Name"]', 'Gallery Test')
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 5-bedroom luxury home'
    )
    await page.click('button:has-text("Generate Blueprint")')

    // Wait for generation
    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })

    // Click save to gallery
    await page.click('button:has-text("Save to Gallery")')

    // Verify it appears in gallery
    await expect(page.locator('text=Saved Blueprints')).toBeVisible()
    await expect(page.locator('text=Gallery Test')).toBeVisible()
  })

  test('should upload image and generate blueprint', async ({ page }) => {
    await page.click('button:has-text("Blueprint Generator")')

    // Click on image tab
    await page.click('button:has-text("From Image")')

    // Fill project name
    await page.fill('input[placeholder*="Project Name"]', 'Image Blueprint')

    // Upload test image (placeholder - would use real test file)
    // In real scenario: await page.setInputFiles('input[type="file"]', 'test-image.jpg')

    // This test demonstrates the flow - actual file upload would need test assets
    await expect(page.locator('text=Upload Image')).toBeVisible()
  })

  test('should manage blueprint gallery', async ({ page }) => {
    await page.click('button:has-text("Blueprint Generator")')

    // Create a blueprint
    await page.fill('input[placeholder*="Project Name"]', 'Gallery Blueprint')
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 3-bedroom home'
    )
    await page.click('button:has-text("Generate Blueprint")')

    // Wait and save
    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })
    await page.click('button:has-text("Save to Gallery")')

    // Click on the blueprint in gallery to select it
    await page.click('text=Gallery Blueprint')

    // Verify details panel appears
    await expect(page.locator('text=Details')).toBeVisible()
  })
})

test.describe('Blueprint Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should export blueprint as PDF', async ({ page, context }) => {
    await page.click('button:has-text("Blueprint Generator")')
    await page.fill('input[placeholder*="Project Name"]', 'PDF Export Test')
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 4-bedroom home with garage'
    )
    await page.click('button:has-text("Generate Blueprint")')

    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })

    // Try to download PDF (if available)
    const downloadPromise = page.waitForEvent('download')
    const pdfButtons = await page.locator('button:has-text("Download PDF")').count()

    if (pdfButtons > 0) {
      await page.click('button:has-text("Download PDF")')
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('blueprint.pdf')
    }
  })
})

test.describe('Real Estate Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should display real estate recommendations', async ({ page }) => {
    // Generate a blueprint
    await page.click('button:has-text("Blueprint Generator")')
    await page.fill('input[placeholder*="Project Name"]', 'Real Estate Test')
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 4-bedroom modern home in suburban area'
    )
    await page.click('button:has-text("Generate Blueprint")')

    // Check for real estate data (when section is added)
    // This is a placeholder for when the feature is integrated
    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })
  })
})

test.describe('3D Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should display 3D floor plan', async ({ page }) => {
    await page.click('button:has-text("Blueprint Generator")')
    await page.fill('input[placeholder*="Project Name"]', '3D Test')
    await page.fill(
      'textarea[placeholder*="Design Description"]',
      'A 4-bedroom home'
    )
    await page.click('button:has-text("Generate Blueprint")')

    await page.waitForSelector('text=Blueprint Generated', { timeout: 10000 })

    // Check for 3D canvas (when integrated)
    // Placeholder for 3D viewer integration test
  })
})

test.describe('Collaboration Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should show collaboration interface', async ({ page }) => {
    // Navigate to blueprints
    await page.click('button:has-text("Blueprint Generator")')

    // When collaboration UI is integrated, verify:
    // - Share button is visible
    // - Collaborator list is accessible
    // - Invite functionality works
  })
})
