import { useEffect, useRef, useState } from 'react'
import { auth } from '../../lib/firebase'
import './Applications.css'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
const API =
    import.meta.env.VITE_API_URL || 'http://localhost:5000'

const detailLabels = {
    phone: 'Phone',
    dateOfBirth: 'Date of birth',
    occupation: 'Occupation',
    idType: 'ID type',
    idNumber: 'ID number',
    idIssuingCountry: 'ID issuing country',
    addressLine1: 'Address line 1',
    addressLine2: 'Address line 2',
    city: 'City / town',
    region: 'State / division / district',
    postalCode: 'Postal code',
    country: 'Country',
    referringMember: 'Referring member',
    introduction: 'Reason for joining',
}

async function request(path, options = {}) {
    const user = auth.currentUser

    if (!user) {
        throw new Error('Please sign in again.')
    }

    const token = await user.getIdToken()

    const response = await fetch(`${API}/api/membership${path}`, {
        ...options,
        headers: {
            ...(options.body
                ? { 'Content-Type': 'application/json' }
                : {}),
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(
            data.message || 'Request failed. Please try again.',
        )
    }

    return data
}

export default function Applications() {
    const [applications, setApplications] = useState([])
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [revision, setRevision] = useState(0)

    const dialogRef = useRef(null)
    const reviewButtonRef = useRef(null)

    useEffect(() => {
        if (selected && !dialogRef.current?.open) {
            dialogRef.current?.showModal()
        }
    }, [selected])

    useEffect(() => {
        const controller = new AbortController()

        async function load() {
            setLoading(true)
            setError('')

            try {
                const data = await request('/applications', {
                    signal: controller.signal,
                })

                if (!Array.isArray(data.applications)) {
                    throw new Error('Unable to load applications.')
                }

                if (!controller.signal.aborted) {
                    setApplications(data.applications)
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(err.message)
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        load()

        return () => controller.abort()
    }, [revision])

    async function openApplication(id, button) {
        if (busy) return

        reviewButtonRef.current = button
        setBusy(true)
        setError('')
        setMessage('')
        setSelected(null)

        try {
            const data = await request(`/applications/${id}`)

            if (!data.application) {
                throw new Error('Application details are unavailable.')
            }

            setSelected(data.application)
        } catch (err) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    function closeApplication() {
        if (busy) return
        dialogRef.current?.close()
    }

    function handleDialogClose() {
        setSelected(null)
        setError('')

        if (reviewButtonRef.current?.isConnected) {
            reviewButtonRef.current.focus()
        }
    }

    function handleBackdropClick(event) {
        if (event.target !== event.currentTarget || busy) return

        const bounds = event.currentTarget.getBoundingClientRect()

        if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
        ) {
            closeApplication()
        }
    }

    async function review(decision) {
        if (!selected || busy) return

        const applicationId = selected._id
        const name = `${selected.firstName} ${selected.lastName}`
        const approving = decision === 'approve'

        // Prevent closing the review dialog while confirming.
        setBusy(true)
        setError('')
        setMessage('')

        try {
            const result = await Swal.fire({
                target: dialogRef.current,
                titleText: approving
                    ? 'Approve membership?'
                    : 'Reject application?',
                text: approving
                    ? `${name} will receive access to the member dashboard.`
                    : `${name} will not receive membership access.`,
                icon: approving ? 'question' : 'warning',
                iconColor: approving ? '#b28b40' : '#b45353',
                showCancelButton: true,
                confirmButtonText: approving
                    ? 'Yes, Approve'
                    : 'Yes, Reject',
                cancelButtonText: 'Cancel',
                buttonsStyling: false,
                reverseButtons: true,
                focusCancel: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                heightAuto: false,
                customClass: {
                    popup: 'amanah-confirm',
                    title: 'amanah-confirm__title',
                    htmlContainer: 'amanah-confirm__text',
                    actions: 'amanah-confirm__actions',
                    confirmButton: approving
                        ? 'amanah-confirm__button amanah-confirm__approve'
                        : 'amanah-confirm__button amanah-confirm__reject',
                    cancelButton:
                        'amanah-confirm__button amanah-confirm__cancel',
                },
            })

            if (!result.isConfirmed) return

            const data = await request(
                `/applications/${applicationId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ decision }),
                },
            )

            setMessage(data.message)
            dialogRef.current?.close()
            setRevision((value) => value + 1)
        } catch (err) {
            setError(err.message || 'Unable to save your decision.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <section className="amanah-applications">
            <div className="amanah-applications__toolbar">
                <div>
                    <h2>Pending Requests</h2>
                    <p>
                        Review applications before granting membership.
                    </p>
                </div>

                <button
                    type="button"
                    disabled={loading || busy}
                    onClick={() => {
                        setSelected(null)
                        setRevision((value) => value + 1)
                    }}
                >
                    Refresh
                </button>
            </div>

            {error && !selected && (
                <p
                    className="amanah-applications__error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {message && (
                <p
                    className="amanah-applications__success"
                    role="status"
                >
                    {message}
                </p>
            )}

            {loading ? (
                <p role="status">Loading applications…</p>
            ) : applications.length === 0 ? (
                <div className="amanah-applications__empty">
                    <h3>No pending applications.</h3>
                    <p>New membership requests will appear here.</p>
                </div>
            ) : (
                <div className="amanah-applications__table-wrap">
                    <table>
                        <caption className="amanah-applications__caption">
                            Latest pending membership applications
                        </caption>

                        <thead>
                            <tr>
                                <th scope="col">Applicant</th>
                                <th scope="col">Shares</th>
                                <th scope="col">Applied</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id}>
                                    <td>
                                        <strong>
                                            {application.firstName}{' '}
                                            {application.lastName}
                                        </strong>
                                        <span>{application.email}</span>
                                    </td>

                                    <td>{application.shares}</td>

                                    <td>
                                        {new Date(
                                            application.createdAt,
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={(event) =>
                                                openApplication(
                                                    application._id,
                                                    event.currentTarget,
                                                )
                                            }
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {busy && !selected && (
                <p role="status">Loading application details…</p>
            )}

            {selected && (
                <dialog
                    ref={dialogRef}
                    className="amanah-applications__modal"
                    aria-labelledby="application-review-title"
                    onCancel={(event) => {
                        if (busy) event.preventDefault()
                    }}
                    onClose={handleDialogClose}
                    onClick={handleBackdropClick}
                >
                    <section
                        className="amanah-applications__details"
                        aria-busy={busy}
                    >
                        <div className="amanah-applications__toolbar">
                            <div>
                                <h2 id="application-review-title">
                                    {selected.firstName} {selected.lastName}
                                </h2>
                                <p>{selected.email}</p>
                            </div>

                            <button
                                type="button"
                                disabled={busy}
                                autoFocus
                                onClick={closeApplication}
                            >
                                Close
                            </button>
                        </div>

                        {error && (
                            <p
                                className="amanah-applications__error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        <dl>
                            <div>
                                <dt>Requested shares</dt>
                                <dd>{selected.shares}</dd>
                            </div>

                            <div>
                                <dt>Status</dt>
                                <dd>{selected.status}</dd>
                            </div>

                            {Object.entries(detailLabels).map(
                                ([key, label]) => (
                                    <div key={key}>
                                        <dt>{label}</dt>
                                        <dd>
                                            {selected.application?.[key] || '—'}
                                        </dd>
                                    </div>
                                ),
                            )}
                        </dl>

                        {busy && (
                            <p role="status">Saving your decision…</p>
                        )}

                        {selected.status === 'pending' && (
                            <div className="amanah-applications__actions">
                                <button
                                    type="button"
                                    className="amanah-applications__approve"
                                    disabled={busy}
                                    onClick={() => review('approve')}
                                >
                                    Approve Membership
                                </button>

                                <button
                                    type="button"
                                    className="amanah-applications__reject"
                                    disabled={busy}
                                    onClick={() => review('reject')}
                                >
                                    Reject Application
                                </button>
                            </div>
                        )}
                    </section>
                </dialog>
            )}
        </section>
    )
}