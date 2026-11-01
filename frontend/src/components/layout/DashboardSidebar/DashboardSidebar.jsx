import {
  LayoutDashboard,
  Users,
  UserPlus,
  Wallet,
  TrendingUp,
  FileText,
  UserRound,
  X,
} from 'lucide-react'
import './DashboardSidebar.css'

const adminItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'applications', label: 'Applications', icon: UserPlus },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: FileText },
]

const memberItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'contributions', label: 'My Contributions', icon: Wallet },
  { id: 'payment-confirmation', label: 'Confirm Payment', icon: Wallet},
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'statements', label: 'My Statements', icon: FileText },
  { id: 'profile', label: 'My Profile', icon: UserRound },
]

export default function DashboardSidebar({
  isAdminView,
  activePage,
  onSelect,
  open,
  onClose,
}) {
  const items = isAdminView ? adminItems : memberItems

  return (
    <aside
      id="dashboard-sidebar"
      className={`dashboard-sidebar ${
        open ? 'dashboard-sidebar--open' : ''
      }`}
      aria-label={
        isAdminView ? 'Admin sidebar' : 'Member sidebar'
      }
    >
      <div className="dashboard-sidebar__heading">
        <p>{isAdminView ? 'Management' : 'My Membership'}</p>

        <button
          type="button"
          className="dashboard-sidebar__close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Dashboard sections">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="dashboard-sidebar__item"
            aria-current={activePage === id ? 'page' : undefined}
            onClick={() => {
              onSelect(id)
              onClose()
            }}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-sidebar__note">
        <span>Amanah</span>
        <p>Shared savings. Shared purpose.</p>
      </div>
    </aside>
  )
}