import { useState } from 'react'
import { useOutletContext } from 'react-router'
import { Menu } from 'lucide-react'
import DashboardNavbar from '../../components/layout/DashboardNavbar/DashboardNavbar'
import DashboardSidebar from '../../components/layout/DashboardSidebar/DashboardSidebar'
import Applications from './Applications'
import PaymentConfirmation from './PaymentConfirmation'

const pageTitles = {
  overview: 'Overview',
  members: 'Members',
  applications: 'Membership Applications',
  payments: 'Payments',
  investments: 'Investments',
  reports: 'Reports',
  contributions: 'My Contributions',
  statements: 'My Statements',
  profile: 'My Profile',
  'payment-confirmation': 'Confirm Payment',
}

export default function Dashboard() {
  const { member } = useOutletContext()

  const [view, setView] = useState(
    member.role === 'admin' ? 'admin' : 'member',
  )
  const [activePage, setActivePage] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdminView =
    member.role === 'admin' && view === 'admin'

  function handleViewChange(nextView) {
    setView(
      member.role === 'admin' ? nextView : 'member',
    )
    setActivePage('overview')
    setSidebarOpen(false)
  }

  return (
    <div className="amanah-dashboard">
      <title>{pageTitles[activePage]} | Amanah</title>

      <DashboardNavbar
        member={member}
        view={view}
        onViewChange={handleViewChange}
      />

      <div className="amanah-dashboard__body">
        <button
          type="button"
          className="amanah-dashboard__menu"
          aria-expanded={sidebarOpen}
          aria-controls="dashboard-sidebar"
          onClick={() => setSidebarOpen((value) => !value)}
        >
          <Menu size={19} aria-hidden="true" />
          Menu
        </button>

        <DashboardSidebar
          isAdminView={isAdminView}
          activePage={activePage}
          onSelect={setActivePage}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="amanah-dashboard__content">
          <header className="amanah-dashboard__page-heading">
            <h1>{pageTitles[activePage]}</h1>

            {activePage !== 'payment-confirmation' && (
              <p>
                {activePage === 'overview'
                  ? `Welcome, ${member.firstName}. ${isAdminView
                    ? 'Manage Amanah’s membership and shared activities.'
                    : 'Follow your shares, contributions and membership updates.'
                  }`
                  : `${isAdminView ? 'Admin' : 'Member'
                  } Portal / ${pageTitles[activePage]}`}
              </p>
            )}
          </header>

          {isAdminView && activePage === 'applications' ? (
            <Applications />
          ) : !isAdminView && activePage === 'payment-confirmation' ? (
            <PaymentConfirmation />
          ) : (
            <section className="amanah-dashboard__placeholder">
              {activePage === 'overview'
                ? 'Your dashboard overview will appear here.'
                : `${pageTitles[activePage]} is not available yet.`}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}