import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Claude Code UI/)
  })

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation items
    const navItems = ['Dashboard', 'Claude', 'Terminal', 'Projects', 'Git']

    for (const item of navItems) {
      await expect(page.getByRole('link', { name: item })).toBeVisible()
    }
  })

  test('should navigate to terminal page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Terminal' }).click()

    await expect(page).toHaveURL('/terminal')
    await expect(page.locator('.terminal-container')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check if mobile menu is present
    await expect(page.locator('header')).toBeVisible()
  })
})
