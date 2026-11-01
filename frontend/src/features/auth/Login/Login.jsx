import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
} from 'lucide-react'
import { auth } from '../../../lib/firebase'
import './Login.css'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [member, setMember] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '')

    setLoading(true)
    setError('')
    setMember(null)

    let firebaseSignedIn = false

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )

      firebaseSignedIn = true

      const token = await credential.user.getIdToken()

      const response = await fetch(`${API_URL}/api/membership/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to verify your membership.',
        )
      }


      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (firebaseSignedIn) {
        await signOut(auth).catch(() => {})
      }

      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-email':
          setError('Email or password is incorrect.')
          break
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.')
          break
        case 'auth/network-request-failed':
          setError('Check your internet connection and try again.')
          break
        case 'auth/user-disabled':
          setError('This account is disabled. Contact the team.')
          break
        default:
          setError(
            err instanceof TypeError
              ? 'Cannot reach the server. Please try again.'
              : err.code
                ? 'Unable to sign in. Please try again.'
                : err.message || 'Unable to sign in.',
          )
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)
    setError('')

    try {
      await signOut(auth)
      setMember(null)
    } catch {
      setError('Unable to sign out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="amanah-login">
      <title>Login | Amanah</title>

      <section className="amanah-login__story">
        <p className="amanah-login__eyebrow">
          Amanah Member Portal
        </p>

        <h1>
          Your Savings.
          <span>Our Shared Journey.</span>
        </h1>

        <div
          className="amanah-login__divider"
          aria-hidden="true"
        />

        <p className="amanah-login__description">
          A dedicated space for members to stay connected
          with their contributions and Amanah’s progress.
        </p>

        <p className="amanah-login__caption">
          Shared savings. Shared purpose.
        </p>
      </section>

      <section
        className="amanah-login__card"
        aria-labelledby="login-title"
      >
        <span className="amanah-login__icon">
          <LockKeyhole size={25} aria-hidden="true" />
        </span>

        <h2 id="login-title">
          {member ? `Welcome, ${member.firstName}.` : 'Welcome back.'}
        </h2>

        <p className="amanah-login__subtitle">
          {member
            ? 'Your Amanah membership has been verified.'
            : 'Sign in to your Amanah member account.'}
        </p>

        {error && (
          <p className="amanah-login__error" role="alert">
            {error}
          </p>
        )}

        {member ? (
          <div className="amanah-login__form">
            <div
              className="amanah-login__success"
              role="status"
            >
              <p>Signed in successfully.</p>
              <p>
                Account: {member.email}
                <br />
                Role: {member.role}
              </p>
            </div>

            <button
              type="button"
              className="amanah-login__submit"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <>
            <form
              className="amanah-login__form"
              onSubmit={handleSubmit}
              aria-busy={loading}
            >
              <div className="amanah-login__field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  maxLength={254}
                  disabled={loading}
                  required
                />
              </div>

              <div className="amanah-login__field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="amanah-login__password">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    className="amanah-login__password-toggle"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    aria-controls="login-password"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} aria-hidden="true" />
                    ) : (
                      <Eye size={19} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="amanah-login__help">
                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="amanah-login__submit"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="amanah-login__join">
              <p>Not a member yet?</p>

              <Link to="/become-a-member">
                Become a Member
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}