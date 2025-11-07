import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('health check endpoint should return 200', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const json = await response.json()
    expect(json).toHaveProperty('status', 'ok')
  })

  test('claude chat endpoint should require message', async ({ request }) => {
    const response = await request.post('/api/claude/chat', {
      data: {},
    })

    expect(response.status()).toBe(400)
    const json = await response.json()
    expect(json).toHaveProperty('error')
  })

  test('terminal execute endpoint should have rate limiting', async ({ request }) => {
    const responses = []

    // Make multiple requests quickly
    for (let i = 0; i < 35; i++) {
      responses.push(
        await request.post('/api/terminal/execute', {
          data: { command: 'echo test' },
        })
      )
    }

    // Check if we hit rate limit (should get 429)
    const rateLimitedResponses = responses.filter((r) => r.status() === 429)
    expect(rateLimitedResponses.length).toBeGreaterThan(0)
  })

  test('git status endpoint should return valid data', async ({ request }) => {
    const response = await request.get('/api/git/status')

    if (response.ok()) {
      const json = await response.json()
      expect(json).toHaveProperty('status')
    } else {
      // May fail if not in git repo
      expect([404, 500]).toContain(response.status())
    }
  })
})
