import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi, beforeEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './src/mocks/handlers'
import { resetCategories } from './src/mocks/data'

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

vi.stubGlobal('ResizeObserver', ResizeObserver)

// Setup MSW

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

beforeEach(() => {
  resetCategories()
})

afterAll(() => {
  server.close()
})
