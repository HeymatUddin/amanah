import { useState } from 'react'
import { Link } from 'react-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { auth } from '../../../lib/firebase'
import '../Login/Login.css'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setMessage('')
    setError('')

    try {
      await sendPasswordResetEmail(auth, email.trim())

      setMessage(
        'If an eligible account exists for this email, you will receive a password reset link. Please check your inbox and spam folder.',
      )
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setMessage(
            'If an eligible account exists for this email, you will receive a password reset link. Please check your inbox and spam folder.',
          )
          break
        case 'auth/invalid-email':
        case 'auth/missing-email':
          setError('Please enter a valid email address.')
          break
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.')
          break
        case 'auth/network-request-failed':
          setError('Check your internet connection and try again.')
          break
        default:
          setError(
            'Unable to request a reset link. Please try again later.',
          )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="amanah-login">
      <title>Forgot Password | Amanah</title>

      <section className="amanah-login__story">
        <p className="amanah-login__eyebrow">
          Account Recovery
        </p>

        <h1>
          A Fresh Start.
          <span>Back to Your Journey.</span>
        </h1>

        <div
          className="amanah-login__divider"
          aria-hidden="true"
        />

        <p className="amanah-login__description">
          Reset your password and reconnect with your
          Amanah member account.
        </p>

        <p className="amanah-login__caption">
          Shared savings. Shared purpose.
        </p>
      </section>

      <section
        className="amanah-login__card"
        aria-labelledby="forgot-password-title"
      >
        <span className="amanah-login__icon">
          <Mail size={25} aria-hidden="true" />
        </span>

        <h2 id="forgot-password-title">
          Forgot password?
        </h2>

        <p className="amanah-login__subtitle">
          Enter your account email to request a password
          reset link.
        </p>

        {error && (
          <p className="amanah-login__error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <div
            className="amanah-login__success amanah-forgot__message"
            role="status"
          >
            {message}
          </div>
        )}

        <form
          className="amanah-login__form"
          onSubmit={handleSubmit}
          aria-busy={loading}
        >
          <div className="amanah-login__field">
            <label htmlFor="reset-email">
              Email address
            </label>

            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="amanah-login__submit"
            disabled={loading}
          >
            {loading ? 'Requesting…' : 'Send Reset Link'}
            <Send size={17} aria-hidden="true" />
          </button>
        </form>

        <div className="amanah-login__join">
          <Link to="/login">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Login
          </Link>
        </div>
      </section>
    </div>
  )
}