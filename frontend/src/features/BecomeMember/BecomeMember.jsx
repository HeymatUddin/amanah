import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../../lib/firebase'
import {
    ArrowRight,
    Check,
    CalendarDays,
    Wallet,
    Users,
} from 'lucide-react'
import './BecomeMember.css'

export default function BecomeMember() {
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        if (saving) return

        const form = new FormData(event.currentTarget)
        const values = Object.fromEntries(form.entries())

        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        const email = String(values.email || '').trim()
        const password = String(values.password || '')

        // Passwords are sent only to Firebase, never our backend.
        delete values.password
        delete values.confirmPassword
        delete values.email

        const payload = {
            ...values,
            shares: Number(values.shares),
            informationConfirmed: form.has('informationConfirmed'),
            policyAccepted: form.has('policyAccepted'),
            reviewConsent: form.has('reviewConsent'),
        }

        setSaving(true)
        setError('')

        try {
            let user

            if (auth.currentUser) {
                if (
                    auth.currentUser.email?.toLowerCase() !==
                    email.toLowerCase()
                ) {
                    throw new Error(
                        'Another account is signed in. Sign out before applying.',
                    )
                }

                user = auth.currentUser
            } else {
                try {
                    const credential = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    )
                    user = credential.user
                } catch (err) {
                    if (err.code !== 'auth/email-already-in-use') throw err

                    // Allows retry if Firebase signup succeeded previously
                    // but saving the application failed.
                    const credential = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    )
                    user = credential.user
                }
            }

            const token = await user.getIdToken()
            const api =
                import.meta.env.VITE_API_URL || 'http://localhost:5000'

            const response = await fetch(`${api}/api/membership/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to save your application. Please retry.',
                )
            }

            navigate('/dashboard', { replace: true })
        } catch (err) {
            const messages = {
                'auth/invalid-credential':
                    'This email already has an account. Enter its correct password or use Forgot Password.',
                'auth/weak-password': 'Please choose a stronger password.',
                'auth/password-does-not-meet-requirements':
                    'Your password does not meet the account requirements.',
                'auth/invalid-email': 'Please enter a valid email.',
                'auth/network-request-failed':
                    'Check your internet connection and try again.',
                'auth/too-many-requests':
                    'Too many attempts. Please try again later.',
            }

            setError(
                messages[err.code] ||
                (err.code
                    ? 'Unable to create your account. Please try again.'
                    : err instanceof TypeError
                        ? 'Cannot reach the server. Your account may already exist; retry this form to finish submitting.'
                        : err.message),
            )
        } finally {
            setSaving(false)
        }
    }
    const [shares, setShares] = useState('1')

    const shareCount = Math.max(
        0,
        Number.parseInt(shares, 10) || 0,
    )

    const money = (amount) =>
        new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            maximumFractionDigits: 0,
        }).format(amount)

    return (
        <div className="amanah-join">
            <title>Become a Member | Amanah</title>

            <header className="amanah-join__hero">
                <p className="amanah-join__eyebrow">
                    Grow Together
                </p>

                <h1>
                    A Shared Commitment.
                    <span>A Meaningful Beginning.</span>
                </h1>

                <p>
                    Join a community built on trust, disciplined
                    savings and a shared purpose.
                </p>
            </header>

            <div className="amanah-join__layout">
                <aside className="amanah-join__sidebar">
                    <section className="amanah-join__intro">
                        <p className="amanah-join__label">
                            Before You Apply
                        </p>

                        <h2>Understand your commitment.</h2>

                        <p>
                            Membership involves regular contributions,
                            participation and respect for Amanah’s
                            collective decisions.
                        </p>
                    </section>

                    <div className="amanah-join__fact">
                        <CalendarDays size={23} aria-hidden="true" />

                        <div>
                            <h3>January Admission</h3>
                            <p>
                                New members are admitted only in January,
                                subject to approval.
                            </p>
                        </div>
                    </div>

                    <div className="amanah-join__fact">
                        <Wallet size={23} aria-hidden="true" />

                        <div>
                            <h3>Share-based Contributions</h3>
                            <p>
                                BDT 1,500 monthly, plus two additional
                                BDT 5,000 contributions each year,
                                per share.
                            </p>
                        </div>
                    </div>

                    <div className="amanah-join__fact">
                        <Users size={23} aria-hidden="true" />

                        <div>
                            <h3>One Member. One Vote.</h3>
                            <p>
                                New members join as General Members.
                                Each member has one vote, regardless
                                of shares held.
                            </p>
                        </div>
                    </div>

                    <section className="amanah-join__estimate">
                        <p className="amanah-join__label">
                            Your Contribution Plan
                        </p>

                        <h3>
                            {shareCount} {shareCount === 1 ? 'Share' : 'Shares'}
                        </h3>

                        <dl>
                            <div>
                                <dt>Monthly contribution</dt>
                                <dd>{money(shareCount * 1500)}</dd>
                            </div>

                            <div>
                                <dt>Each additional instalment</dt>
                                <dd>{money(shareCount * 5000)}</dd>
                            </div>

                            <div className="amanah-join__annual">
                                <dt>Total per year</dt>
                                <dd>{money(shareCount * 28000)}</dd>
                            </div>
                        </dl>

                        <p className="amanah-join__estimate-note">
                            Two additional instalments are required
                            each year. Investments may result in
                            profits or losses; returns are not guaranteed.
                        </p>
                    </section>
                </aside>

                <section
                    className="amanah-join__form-card"
                    aria-labelledby="membership-form-title"
                >
                    <p className="amanah-join__label">
                        Membership Application
                    </p>

                    <h2 id="membership-form-title">
                        Tell us about yourself.
                    </h2>

                    <p className="amanah-join__form-description">
                        Complete your details below. Membership
                        requires review and approval.
                    </p>

                    <form
                        className="amanah-join__form"
                        onSubmit={handleSubmit}
                        aria-busy={saving}
                    >
                        <h3 className="amanah-join__section-title">
                            Personal Information
                        </h3>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-first-name">First name *</label>
                                <input
                                    id="join-first-name"
                                    name="firstName"
                                    autoComplete="given-name"
                                    placeholder="As shown on your ID"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-last-name">Last name *</label>
                                <input
                                    id="join-last-name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    placeholder="As shown on your ID"
                                    maxLength={100}
                                    required
                                />
                            </div>
                        </div>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-email">Email address *</label>
                                <input
                                    id="join-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    maxLength={254}
                                    required
                                />
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-phone">Phone number *</label>
                                <input
                                    id="join-phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="Include country code"
                                    maxLength={30}
                                    required
                                />
                            </div>
                            <div className="amanah-join__row">
                                <div className="amanah-join__field">
                                    <label htmlFor="join-password">Password *</label>
                                    <input
                                        id="join-password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
                                        minLength={8}
                                        required
                                    />
                                </div>

                                <div className="amanah-join__field">
                                    <label htmlFor="join-confirm-password">
                                        Confirm password *
                                    </label>
                                    <input
                                        id="join-confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Repeat your password"
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-dob">Date of birth *</label>
                                <input
                                    id="join-dob"
                                    name="dateOfBirth"
                                    type="date"
                                    autoComplete="bday"
                                    max={new Date().toLocaleDateString('en-CA')}
                                    required
                                />
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-occupation">
                                    Occupation
                                </label>
                                <input
                                    id="join-occupation"
                                    name="occupation"
                                    placeholder="e.g. Student, employed, business owner"
                                    maxLength={120}
                                />
                            </div>
                        </div>

                        <h3 className="amanah-join__section-title">
                            Identity Information
                        </h3>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-id-type">ID type *</label>
                                <select
                                    id="join-id-type"
                                    name="idType"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select ID type</option>
                                    <option value="national-id">National ID</option>
                                    <option value="passport">Passport</option>
                                    <option value="driving-licence">
                                        Driving Licence
                                    </option>
                                </select>
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-id-number">ID number *</label>
                                <input
                                    id="join-id-number"
                                    name="idNumber"
                                    type="text"
                                    placeholder="Enter the selected ID number"
                                    maxLength={50}
                                    autoCapitalize="characters"
                                    spellCheck={false}
                                    required
                                />
                            </div>
                        </div>

                        <div className="amanah-join__field">
                            <label htmlFor="join-id-country">
                                ID issuing country *
                            </label>
                            <input
                                id="join-id-country"
                                name="idIssuingCountry"
                                placeholder="e.g. Bangladesh"
                                maxLength={100}
                                required
                            />
                        </div>

                        <h3 className="amanah-join__section-title">
                            Current Residential Address
                        </h3>

                        <div className="amanah-join__field">
                            <label htmlFor="join-address-1">
                                Address line 1 *
                            </label>
                            <input
                                id="join-address-1"
                                name="addressLine1"
                                autoComplete="address-line1"
                                placeholder="House / flat, road or street"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className="amanah-join__field">
                            <label htmlFor="join-address-2">
                                Address line 2
                            </label>
                            <input
                                id="join-address-2"
                                name="addressLine2"
                                autoComplete="address-line2"
                                placeholder="Area, village or locality (optional)"
                                maxLength={200}
                            />
                        </div>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-city">City / town *</label>
                                <input
                                    id="join-city"
                                    name="city"
                                    autoComplete="address-level2"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-region">
                                    State / division / district *
                                </label>
                                <input
                                    id="join-region"
                                    name="region"
                                    autoComplete="address-level1"
                                    maxLength={100}
                                    required
                                />
                            </div>
                        </div>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-postcode">Postal code</label>
                                <input
                                    id="join-postcode"
                                    name="postalCode"
                                    autoComplete="postal-code"
                                    maxLength={20}
                                />
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-country">Country *</label>
                                <input
                                    id="join-country"
                                    name="country"
                                    autoComplete="country-name"
                                    placeholder="Country of residence"
                                    maxLength={100}
                                    required
                                />
                            </div>
                        </div>

                        <h3 className="amanah-join__section-title">
                            Membership Details
                        </h3>

                        <div className="amanah-join__row">
                            <div className="amanah-join__field">
                                <label htmlFor="join-shares">
                                    Requested shares *
                                </label>
                                <input
                                    id="join-shares"
                                    name="shares"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    step={1}
                                    value={shares}
                                    onChange={(event) => setShares(event.target.value)}
                                    aria-describedby="join-shares-note"
                                    required
                                />
                                <small id="join-shares-note">
                                    Final allocation is subject to approval.
                                </small>
                            </div>

                            <div className="amanah-join__field">
                                <label htmlFor="join-referrer">
                                    Referring member
                                </label>
                                <input
                                    id="join-referrer"
                                    name="referringMember"
                                    placeholder="Member’s name, if applicable"
                                    maxLength={150}
                                />
                            </div>
                        </div>

                        <div className="amanah-join__field">
                            <label htmlFor="join-introduction">
                                Why would you like to join Amanah? *
                            </label>
                            <textarea
                                id="join-introduction"
                                name="introduction"
                                rows={4}
                                placeholder="Tell us about your interest and commitment."
                                maxLength={2000}
                                required
                            />
                        </div>

                        <h3 className="amanah-join__section-title">
                            Declarations & Consent
                        </h3>

                        <label className="amanah-join__checkbox">
                            <input
                                type="checkbox"
                                name="informationConfirmed"
                                required
                            />
                            <span>
                                I confirm that the information provided is accurate
                                and that the identity information belongs to me.
                            </span>
                        </label>

                        <label className="amanah-join__checkbox">
                            <input
                                type="checkbox"
                                name="policyAccepted"
                                required
                            />
                            <span>
                                I have read the{' '}
                                <Link
                                    to="/policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Amanah policies
                                </Link>{' '}
                                and understand the contribution commitments,
                                membership rules and investment risks.
                            </span>
                        </label>

                        <label className="amanah-join__checkbox">
                            <input
                                type="checkbox"
                                name="reviewConsent"
                                required
                            />
                            <span>
                                I agree that Amanah may use my submitted details
                                for membership review, identity verification and
                                communication about my application.
                            </span>
                        </label>

                        <div className="amanah-join__notice">
                            <Check size={19} aria-hidden="true" />
                            <p>
                                Membership is subject to approval and January
                                admission. No payment is collected through this form.
                            </p>
                        </div>

                        {error && (
                            <p role="alert" style={{ color: '#9f1239', lineHeight: 1.8 }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="amanah-join__submit"
                            disabled={saving}
                        >
                            {saving ? 'Submitting…' : 'Create Account & Apply'}
                            <ArrowRight size={18} aria-hidden="true" />
                        </button>

                        <p className="amanah-join__availability">
                            Your account will be created immediately.
                            Dashboard access requires membership approval.
                        </p>
                    </form>
                </section>
            </div>
        </div>
    )
}