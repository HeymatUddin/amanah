import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react'
import './NotFound.css'

export default function NotFound() {
  function handleGoBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.replace('/')
    }
  }

  return (
    <section
      className="amanah-not-found"
      aria-labelledby="not-found-title"
    >
      <title>Page Not Found | Amanah</title>

      <div className="amanah-not-found__content">
        <p className="amanah-not-found__eyebrow">
          A Little Off Course
        </p>

        <div className="amanah-not-found__visual" aria-hidden="true">
          <span className="amanah-not-found__number">404</span>

          <span className="amanah-not-found__compass">
            <Compass size={36} strokeWidth={1.4} />
          </span>
        </div>

        <h1 id="not-found-title">
          Let’s find your way back.
        </h1>

        <p className="amanah-not-found__description">
          The page you’re looking for may have moved,
          or the link might be incorrect.
          Your journey with Amanah continues here.
        </p>

        <div className="amanah-not-found__actions">
          <Link to="/" className="amanah-not-found__home">
            Back to Home
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="amanah-not-found__back"
            onClick={handleGoBack}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Go Back
          </button>
        </div>

        <p className="amanah-not-found__help">
          Need a hand? <Link to="/contact">Contact the team</Link>
        </p>
      </div>
    </section>
  )
}