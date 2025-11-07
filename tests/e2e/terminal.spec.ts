import { test, expect } from '@playwright/test'

test.describe('Terminal Page', () => {
  test('should load terminal page', async ({ page }) => {
    await page.goto('/terminal')

    // Wait for terminal to initialize
    await page.waitForSelector('.terminal-container', { timeout: 10000 })

    const terminal = page.locator('.terminal-container')
    await expect(terminal).toBeVisible()
  })

  test('should show connection status', async ({ page }) => {
    await page.goto('/terminal')

    // Wait for connection status indicator
    await page.waitForTimeout(2000)

    // Check for connection status (either connected or connecting)
    const statusElement = page.locator('text=/Connected|Connecting.../')
    await expect(statusElement).toBeVisible()
  })

  test('should display terminal content', async ({ page }) => {
    await page.goto('/terminal')

    // Wait for terminal initialization
    await page.waitForTimeout(3000)

    // Check if xterm canvas is present
    const xtermCanvas = page.locator('.xterm-screen')
    await expect(xtermCanvas).toBeVisible()
  })
})
