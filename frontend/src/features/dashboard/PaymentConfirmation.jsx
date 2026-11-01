import { useState } from 'react'
import { Send, Wallet, Info } from 'lucide-react'
import './PaymentConfirmation.css'

export default function PaymentConfirmation() {
    const [method, setMethod] = useState('mobile')
    const [type, setType] = useState('monthly')
    const [message, setMessage] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        setMessage(
            'The form is ready. Payment submission will be enabled once the backend is connected. No request has been sent.',
        )
    }

    return (
        <section
            className="payment-confirmation"
            aria-labelledby="payment-title"
        >
            <header className="payment-confirmation__heading">
                <span className="payment-confirmation__icon">
                    <Wallet size={24} aria-hidden="true" />
                </span>

                <div>
                    <h2 id="payment-title">Payment details</h2>
                    <p>Enter the details of the payment you have already sent.</p>
                </div>
            </header>

            <form
                className="payment-confirmation__form"
                onSubmit={handleSubmit}
            >
                <div className="payment-confirmation__row">
                    <div className="payment-confirmation__field">
                        <label htmlFor="payment-type">
                            Contribution type *
                        </label>

                        <select
                            id="payment-type"
                            name="contributionType"
                            value={type}
                            onChange={(event) => {
                                setType(event.target.value)
                                setMessage('')
                            }}
                        >
                            <option value="monthly">Monthly contribution</option>
                            <option value="annual">Additional annual contribution</option>
                        </select>
                    </div>

                    <div className="payment-confirmation__field">
                        <label htmlFor="payment-period">
                            {type === 'monthly'
                                ? 'Contribution month *'
                                : 'Contribution year *'}
                        </label>

                        {type === 'monthly' ? (
                            <input
                                key="monthly"
                                id="payment-period"
                                name="period"
                                type="month"
                                min="2026-04"
                                required
                            />
                        ) : (
                            <input
                                key="annual"
                                id="payment-period"
                                name="year"
                                type="number"
                                min={2026}
                                step={1}
                                placeholder="e.g. 2026"
                                required
                            />
                        )}
                    </div>
                </div>

                <div className="payment-confirmation__row">
                    <div className="payment-confirmation__field">
                        <label htmlFor="payment-amount">Amount sent (BDT) *</label>

                        <input
                            id="payment-amount"
                            name="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            inputMode="decimal"
                            placeholder="e.g. 1500"
                            required
                        />
                    </div>

                    <div className="payment-confirmation__field">
                        <label htmlFor="payment-date">Payment date *</label>

                        <input
                            id="payment-date"
                            name="paymentDate"
                            type="date"
                            required
                        />
                    </div>
                </div>

                <div className="payment-confirmation__field">
                    <label htmlFor="payment-method">Payment method *</label>

                    <select
                        id="payment-method"
                        name="paymentMethod"
                        value={method}
                        onChange={(event) => {
                            setMethod(event.target.value)
                            setMessage('')
                        }}
                    >
                        <option value="mobile">Mobile banking</option>
                        <option value="bank">Bank transfer</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                {method !== 'cash' ? (
                    <div className="payment-confirmation__row" key={method}>
                        <div className="payment-confirmation__field">
                            <label htmlFor="payment-provider">
                                {method === 'mobile' ? 'Provider *' : 'Bank name *'}
                            </label>

                            {method === 'mobile' ? (
                                <select
                                    id="payment-provider"
                                    name="provider"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select provider</option>
                                    <option value="bKash">bKash</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Rocket">Rocket</option>
                                    <option value="Upay">Upay</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <input
                                    id="payment-provider"
                                    name="provider"
                                    placeholder="Name of the sending bank"
                                    maxLength={100}
                                    required
                                />
                            )}
                        </div>

                        <div className="payment-confirmation__field">
                            <label htmlFor="payment-reference">
                                {method === 'mobile'
                                    ? 'Transaction ID *'
                                    : 'Bank transaction reference *'}
                            </label>

                            <input
                                id="payment-reference"
                                name="reference"
                                placeholder="Enter the transaction reference"
                                maxLength={100}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                ) : (
                    <div className="payment-confirmation__field">
                        <label htmlFor="payment-receiver">
                            Cash received by *
                        </label>

                        <input
                            id="payment-receiver"
                            name="receivedBy"
                            placeholder="Name of the person who received the cash"
                            maxLength={150}
                            required
                        />
                    </div>
                )}

                <div className="payment-confirmation__field">
                    <label htmlFor="payment-note">Additional note</label>

                    <textarea
                        id="payment-note"
                        name="note"
                        rows={3}
                        maxLength={1000}
                        placeholder="Add any details that may help verification."
                    />
                </div>

                <label className="payment-confirmation__checkbox">
                    <input
                        type="checkbox"
                        name="confirmed"
                        required
                    />
                    <span>
                        I confirm that I have already sent this payment
                        and the details provided are accurate.
                    </span>
                </label>

                <aside className="payment-confirmation__notice">
                    <Info size={20} aria-hidden="true" />
                    <p>
                        Your payment will count towards your contributions
                        only after admin verification. Submitting this form
                        does not transfer money.
                    </p>
                </aside>

                {message && (
                    <p className="payment-confirmation__message" role="status">
                        {message}
                    </p>
                )}

                <div className="payment-confirmation__footer">
                    <p>Submission is not connected yet.</p>

                    <button type="submit">
                        Preview Confirmation
                        <Send size={17} aria-hidden="true" />
                    </button>
                </div>
            </form>
        </section>
    )
}