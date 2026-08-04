import { Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'

export function AppLayout() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}
