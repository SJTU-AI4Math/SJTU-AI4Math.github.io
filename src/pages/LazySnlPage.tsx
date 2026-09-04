import { lazy, Suspense } from 'react'

const SnlPage = lazy(() => import('./SnlPage').then((module) => ({
  default: module.SnlPage,
})))

export function LazySnlPage() {
  return <Suspense fallback={null}><SnlPage /></Suspense>
}
