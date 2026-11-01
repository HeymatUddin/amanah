import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { signOut } from 'firebase/auth'
import { LogOut, ShieldCheck, Users } from 'lucide-react'
import { auth } from '../../../lib/firebase'
import './DashboardNavbar.css'

export default function DashboardNavbar({
    member,
    view,
    onViewChange,
}) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isAdmin = member.role === 'admin'
    const fullName = `${member.firstName} ${member.lastName}`.trim()

    const initials = [member.firstName, member.lastName]
        .filter(Boolean)
        .map((name) => name[0])
        .join('')
        .toUpperCase()

    async function handleLogout() {
        if (loading) return

        setLoading(true)
        setError('')

        try {
            await signOut(auth)
            navigate('/login', { replace: true })
        } catch {
            setError('Unable to sign out. Please try again.')
            setLoading(false)
        }
    }

    return (
        <header className="dashboard-navbar">
            <nav
                className="dashboard-navbar__inner"
                aria-label="Dashboard navigation"
            >
                <Link
                    to="/dashboard"
                    className="dashboard-navbar__brand"
                    onClick={() =>
                        onViewChange(isAdmin ? 'admin' : 'member')
                    }
                >
                    <img
                        src="/logo1.png"
                        alt=""
                        className="dashboard-navbar__logo"
                    />

                    <span className="dashboard-navbar__brand-copy">
                        <span className="dashboard-navbar__brand-name">
                            Amanah
                        </span>

                        <span className="dashboard-navbar__brand-caption">
                            {isAdmin && view === 'admin'
                                ? 'Admin Portal'
                                : 'Member Portal'}
                        </span>
                    </span>
                </Link>

                {isAdmin && (
                    <div
                        className="dashboard-navbar__switch"
                        role="group"
                        aria-label="Dashboard view"
                    >
                        <button
                            type="button"
                            aria-pressed={view === 'admin'}
                            onClick={() => onViewChange('admin')}
                        >
                            <ShieldCheck size={16} aria-hidden="true" />
                            Admin View
                        </button>

                        <button
                            type="button"
                            aria-pressed={view === 'member'}
                            onClick={() => onViewChange('member')}
                        >
                            <Users size={16} aria-hidden="true" />
                            Member View
                        </button>
                    </div>
                )}

                <div className="dashboard-navbar__account">
                    <div className="dashboard-navbar__identity">
                        <span
                            className="dashboard-navbar__avatar"
                            aria-hidden="true"
                        >
                            {initials}
                        </span>

                        <div className="dashboard-navbar__user-copy">
                            <span className="dashboard-navbar__name">
                                {fullName}
                            </span>

                            <span className="dashboard-navbar__role">
                                {isAdmin ? 'Administrator' : 'Shareholder'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="dashboard-navbar__logout"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        <LogOut size={18} aria-hidden="true" />

                        <span>
                            {loading ? 'Signing out…' : 'Sign Out'}
                        </span>
                    </button>
                </div>
            </nav>

            {error && (
                <p className="dashboard-navbar__error" role="alert">
                    {error}
                </p>
            )}
        </header>
    )
}