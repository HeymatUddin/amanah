import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
} from 'lucide-react'
import { auth } from '../../../lib/firebase'
import '../Login/Login.css'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const code = params.get('oobCode')
  const mode = params.get('mode')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [visible, setVisible] = useState(false)
  const [checking, setChecking] = useState(true)
  const [valid, setValid] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function checkLink() {
      setChecking(true)
      setValid(false)
      setSuccess(false)
      setError('')
      setPassword('')
      setConfirmation('')

      if (!code || mode !== 'resetPassword') {
        setError('This password reset link is invalid.')
        setChecking(false)
        return
      }

      try {
        const accountEmail = await verifyPasswordResetCode(
          auth,
          code,
        )

        if (!cancelled) {
          setEmail(accountEmail)
          setValid(true)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.code === 'auth/network-request-failed'
              ? 'Check your internet connection and reopen this link.'
              : 'This reset link has expired or is invalid. Please request a new one.',
          )
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    checkLink()

    return () => {
      cancelled = true
    }
  }, [code, mode])

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving || !valid) return

    setError('')

    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)

    try {
      await confirmPasswordReset(auth, code, password)
      setPassword('')
      setConfirmation('')
      setSuccess(true)
      setValid(false)
    } catch (err) {
      if (
        err.code === 'auth/weak-password' ||
        err.code === 'auth/password-does-not-meet-requirements'
      ) {
        setError(
          'Choose a stronger password that meets your account’s password requirements.',
        )
      } else if (err.code === 'auth/network-request-failed') {
        setError('Check your internet connection and try again.')
      } else if (
        err.code === 'auth/expired-action-code' ||
        err.code === 'auth/invalid-action-code'
      ) {
        setValid(false)
        setError(
          'This reset link has expired or has already been used. Request a new one.',
        )
      } else {
        setError('Unable to reset your password. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="amanah-login">
      <title>Reset Password | Amanah</title>

      <section className="amanah-login__story">
        <p className="amanah-login__eyebrow">
          A Fresh Beginning
        </p>

        <h1>
          Renew Your Access.
          <span>Continue Your Journey.</span>
        </h1>

        <div
          className="amanah-login__divider"
          aria-hidden="true"
        />

        <p className="amanah-login__description">
          Create a new password and return to your
          Amanah member account.
        </p>

        <p className="amanah-login__caption">
          Shared savings. Shared purpose.
        </p>
      </section>

      <section
        className="amanah-login__card"
        aria-labelledby="reset-title"
      >
        <span className="amanah-login__icon">
          <LockKeyhole size={25} aria-hidden="true" />
        </span>

        <h2 id="reset-title">
          {success ? 'You’re all set.' : 'A new password.'}
        </h2>

        <p className="amanah-login__subtitle">
          {success
            ? 'Your password has been updated successfully.'
            : 'Choose a strong password you haven’t used before.'}
        </p>

        {checking && (
          <p className="amanah-login__subtitle" role="status">
            Checking your reset link…
          </p>
        )}

        {error && (
          <p className="amanah-login__error" role="alert">
            {error}
          </p>
        )}

        {success ? (
          <div className="amanah-login__form">
            <div className="amanah-login__success" role="status">
              You can now sign in with your new password.
            </div>

            <Link to="/login" className="amanah-login__submit">
              Back to Login
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          valid && !checking && (
            <form
              className="amanah-login__form"
              onSubmit={handleSubmit}
              aria-busy={saving}
            >
              <p className="amanah-login__subtitle">
                Resetting password for <strong>{email}</strong>
              </p>

              <div className="amanah-login__field">
                <label htmlFor="new-password">
                  New password
                </label>

                <div className="amanah-login__password">
                  <input
                    id="new-password"
                    type={visible ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Enter a new password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    minLength={8}
                    disabled={saving}
                    required
                  />

                  <button
                    type="button"
                    className="amanah-login__password-toggle"
                    aria-label={
                      visible ? 'Hide passwords' : 'Show passwords'
                    }
                    onClick={() => setVisible((value) => !value)}
                  >
                    {visible ? (
                      <EyeOff size={19} aria-hidden="true" />
                    ) : (
                      <Eye size={19} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="amanah-login__field">
                <label htmlFor="confirm-password">
                  Confirm new password
                </label>

                <input
                  id="confirm-password"
                  type={visible ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your new password again"
                  value={confirmation}
                  onChange={(event) =>
                    setConfirmation(event.target.value)
                  }
                  minLength={8}
                  disabled={saving}
                  required
                />
              </div>

              <p className="amanah-login__availability">
                Use at least 8 characters.
              </p>

              <button
                type="submit"
                className="amanah-login__submit"
                disabled={saving}
              >
                {saving ? 'Updating…' : 'Update Password'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
          )
        )}

        {!success && (
          <div className="amanah-login__join">
            <Link to={valid ? '/login' : '/forgot-password'}>
              <ArrowLeft size={16} aria-hidden="true" />
              {valid ? 'Back to Login' : 'Request a New Link'}
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}