import { Link } from 'react-router'
import { BriefcaseBusiness, ArrowRight } from 'lucide-react'
import './Investments.css'

export default function Investments() {
  return (
    <section
      className="amanah-investments"
      aria-labelledby="investments-title"
    >
      <div className="amanah-investments__intro">
        <p className="amanah-investments__eyebrow">
          Putting Purpose into Practice
        </p>

        <h2
          id="investments-title"
          className="amanah-investments__title"
        >
          Our Investments
        </h2>

        <p className="amanah-investments__subtitle">
          Explore the ventures we are building together through
          shared savings and responsible decisions.
        </p>
      </div>

      <div className="amanah-investments__panel">
        <div className="amanah-investments__symbol" aria-hidden="true">
          <BriefcaseBusiness size={38} strokeWidth={1.4} />
        </div>

        <div className="amanah-investments__content">
          <span className="amanah-investments__badge">
            Portfolio Updates
          </span>

          <h3>Our investment stories are coming soon.</h3>

          <p>
            An introduction to our ventures and their progress
            will be shared here. Detailed financial records
            will be available to authorised members.
          </p>

          <Link to="/login" className="amanah-investments__link">
            Member Login
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}