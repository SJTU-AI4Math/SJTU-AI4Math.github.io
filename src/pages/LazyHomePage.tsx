import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./HomePage').then((module) => ({
  default: module.HomePage,
})))

export function LazyHomePage() {
  return <Suspense fallback={null}><HomePage /></Suspense>
}
