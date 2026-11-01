import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router'
import { onIdTokenChanged, signOut } from 'firebase/auth'
import { Clock3 } from 'lucide-react'
import { auth } from '../../../lib/firebase'
import '../Login/Login.css'
import './ProtectedRoute.css'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ProtectedRoute() {
  const [state, setState] = useState({
    loading: true,
    status: '',
    member: null,
    error: '',
  })
  const [retry, setRetry] = useState(0)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    let active = true
    let sequence = 0
    let controller

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const request = ++sequence
      controller?.abort()
      const currentController = new AbortController()
      controller = currentController

      setState({
        loading: true,
        status: '',
        member: null,
        error: '',
      })

      if (!user) {
        if (active) {
          setState({
            loading: false,
            status: 'signed-out',
            member: null,
            error: '',
          })
        }
        return
      }

      try {
        const token = await user.getIdToken()

        if (!active || request !== sequence) return

        const response = await fetch(
          `${API_URL}/api/membership/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
            signal: currentController.signal,
          },
        )

        if (response.status === 401) {
          if (active && request === sequence) {
            setState({
              loading: false,
              status: 'signed-out',
              member: null,
              error: '',
            })
          }
          return
        }

        if (!response.ok) throw new Error()

        const data = await response.json()

        if (
          !['active', 'pending', 'disabled', 'suspended', 'not-submitted']
            .includes(data.status) ||
          (data.status === 'active' && !data.member)
        ) {
          throw new Error()
        }

        if (active && request === sequence) {
          setState({
            loading: false,
            status: data.status,
            member: data.member,
            error: '',
          })
        }
      } catch (err) {
        if (
          active &&
          request === sequence &&
          err.name !== 'AbortError'
        ) {
          setState({
            loading: false,
            status: '',
            member: null,
            error: 'Cannot check your membership. Please try again.',
          })
        }
      }
    })

    return () => {
      active = false
      sequence += 1
      controller?.abort()
      unsubscribe()
    }
  }, [retry])

  async function handleSignOut() {
    setSigningOut(true)

    try {
      await signOut(auth)
    } catch {
      setState((previous) => ({
        ...previous,
        error: 'Unable to sign out. Please try again.',
      }))
    } finally {
      setSigningOut(false)
    }
  }

  if (state.status === 'signed-out') {
    return <Navigate to="/login" replace />
  }

  if (!state.loading && state.status === 'active') {
    return <Outlet context={{ member: state.member }} />
  }

  const pending = state.status === 'pending'
  const incomplete = state.status === 'not-submitted'

  return (
    <main>
      <div className="amanah-login amanah-pending__card">
        <title>Membership Status | Amanah</title>

        <section className="amanah-login__card">
          <span className="amanah-login__icon">
            <Clock3 size={25} aria-hidden="true" />
          </span>

          <h2>
            {state.loading
              ? 'Checking your account…'
              : pending
                ? 'Awaiting approval.'
                : incomplete
                  ? 'Complete your application.'
                  : state.error
                    ? 'Please try again.'
                    : 'Membership unavailable.'}
          </h2>

          {!state.loading && (
            <p className="amanah-login__subtitle">
              {pending
                ? 'Your membership application is pending approval. You’ll be able to access your dashboard once approved.'
                : incomplete
                  ? 'Your account exists, but your membership application has not been submitted.'
                  : state.status
                    ? 'Your membership is not active. Please contact the Amanah team.'
                    : 'We could not verify your membership right now.'}
            </p>
          )}

          {state.error && (
            <p className="amanah-login__error" role="alert">
              {state.error}
            </p>
          )}

          <div className="amanah-login__form">
            {incomplete && (
              <Link
                to="/become-a-member"
                className="amanah-login__submit"
              >
                Complete Application
              </Link>
            )}

            <button
              type="button"
              className="amanah-login__submit"
              disabled={state.loading || signingOut}
              onClick={() => setRetry((value) => value + 1)}
            >
              {state.loading ? 'Checking…' : 'Check Approval Status'}
            </button>

            <button
              type="button"
              className="amanah-login__submit"
              disabled={signingOut}
              onClick={handleSignOut}
            >
              {signingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}