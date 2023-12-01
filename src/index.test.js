/**
 * Unit tests for the action's entrypoint, src/index.js
 */

const { run } = require('./main')

// Mock the action's entrypoint
jest.mock('../src/main', () => ({
  run: jest.fn()
}))

describe('index', () => {
  it('calls run when imported', async () => {
    require('./index')

    expect(run).toHaveBeenCalled()
  })
})
