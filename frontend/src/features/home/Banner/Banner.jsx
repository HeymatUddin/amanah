import { Link } from 'react-router'
import {
  ArrowRight,
  Users,
  ChartNoAxesCombined,
  FileCheck2,
} from 'lucide-react'
import './Banner.css'

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Contribute Together',
    description: 'Build a shared fund through regular contributions.',
  },
  {
    number: '02',
    icon: ChartNoAxesCombined,
    title: 'Invest Responsibly',
    description:
      'Explore opportunities aligned with our halal investment principles.',
  },
  {
    number: '03',
    icon: FileCheck2,
    title: 'Stay Informed',
    description: 'Keep contributions and investment records transparent.',
  },
]

export default function Banner() {
  return (
    <section className="amanah-hero" aria-labelledby="amanah-hero-title">
      <div className="amanah-hero__content">
        <p className="amanah-hero__eyebrow">
          Amanah Community
        </p>

        <h1 id="amanah-hero-title" className="amanah-hero__title">
          Shared Savings.
          <span>Shared Purpose.</span>
        </h1>

        <p className="amanah-hero__description">
          A member-led community pooling savings to pursue halal
          investment opportunities with trust, transparency and
          responsibility.
        </p>

        <div className="amanah-hero__actions">
          <Link
            to="/become-a-member"
            className="btn amanah-hero__button amanah-hero__button--primary"
          >
            Become a Member
            <ArrowRight size={19} aria-hidden="true" />
          </Link>

          <Link
            to="/about"
            className="btn amanah-hero__button amanah-hero__button--secondary"
          >
            About Amanah
          </Link>
        </div>
      </div>

      <aside
        className="amanah-approach"
        aria-labelledby="amanah-approach-title"
      >
        <h2
          id="amanah-approach-title"
          className="amanah-approach__heading"
        >
          Our Approach
        </h2>

        <ol className="amanah-approach__steps">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <li key={number} className="amanah-approach__step">
              <span
                className="amanah-approach__number"
                aria-hidden="true"
              >
                {number}
              </span>

              <Icon
                className="amanah-approach__icon"
                size={36}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <div className="amanah-approach__details">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  )
}