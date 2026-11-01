import { createBrowserRouter, Outlet } from 'react-router'

import Navbar from '../components/layout/Navbar/Navbar'
import Footer from '../components/layout/Footer/Footer'

import Home from '../features/home/Home'
import About from '../features/about/about'
import Policy from '../features/policy/Policy'
import Contact from '../features/contact/Contact'
import BecomeMember from '../features/BecomeMember/BecomeMember'
import NotFound from '../features/not-found/NotFound'

import Login from '../features/auth/Login/Login'
import ForgotPassword from '../features/auth/ForgotPassword/ForgotPassword'
import ResetPassword from '../features/auth/ResetPassword/ResetPassword'
import ProtectedRoute from '../features/auth/ProtectedRoute/ProtectedRoute'

import Dashboard from '../features/dashboard/Dashboard'

function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'policy',
        element: <Policy />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'become-a-member',
        element: <BecomeMember />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
])