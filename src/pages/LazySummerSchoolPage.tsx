import { lazy, Suspense } from 'react'

const SummerSchoolPage = lazy(() => import('./SummerSchoolPage').then((module) => ({
  default: module.SummerSchoolPage,
})))

export function LazySummerSchoolPage() {
  return <Suspense fallback={null}><SummerSchoolPage /></Suspense>
}
