import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { AppLayout } from './layout/AppLayout'
import { LazyHomePage } from './pages/LazyHomePage'
import { LazySummerSchoolPage } from './pages/LazySummerSchoolPage'
import { LecturePage } from './pages/LecturePage'

const rootRoute = createRootRoute({ component: AppLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LazyHomePage,
})

const summerSchoolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'summer-school',
  component: Outlet,
})

const summerSchool2026Route = createRoute({
  getParentRoute: () => summerSchoolRoute,
  path: '2026',
  component: LazySummerSchoolPage,
})

const lectureRoute = createRoute({
  getParentRoute: () => summerSchoolRoute,
  path: '2026/lectures/$lectureSlug',
  component: LecturePage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  summerSchoolRoute.addChildren([summerSchool2026Route, lectureRoute]),
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
