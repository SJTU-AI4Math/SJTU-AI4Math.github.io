import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { AppLayout } from './layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { SummerSchoolPage } from './pages/SummerSchoolPage'

const rootRoute = createRootRoute({ component: AppLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const summerSchoolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'summer-school',
  component: Outlet,
})

const summerSchool2026Route = createRoute({
  getParentRoute: () => summerSchoolRoute,
  path: '2026',
  component: SummerSchoolPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  summerSchoolRoute.addChildren([summerSchool2026Route]),
])

export function createAppRouter(initialEntries?: string[]) {
  return createRouter({
    routeTree,
    ...(initialEntries
      ? { history: createMemoryHistory({ initialEntries }) }
      : undefined),
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
