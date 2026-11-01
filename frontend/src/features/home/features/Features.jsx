import {
  Layers3,
  ShieldCheck,
  ClipboardList,
  UserRound,
} from 'lucide-react'
import './Features.css'

const features = [
  {
    icon: Layers3,
    title: 'Share-Based Savings',
    description:
      'Contribute according to the number of shares you hold, with clear monthly and half-yearly commitments.',
  },
  {
    icon: ShieldCheck,
    title: 'Halal Investment Focus',
    description:
      'Pursue investment opportunities guided by our commitment to halal practices and responsible decisions.',
  },
  {
    icon: ClipboardList,
    title: 'Transparent Records',
    description:
      'Keep contributions, expenses and investment activities clearly recorded for accountability.',
  },
  {
    icon: UserRound,
    title: 'Member Access',
    description:
      'A dedicated space for members to view their contributions, payment history and outstanding dues.',
  },
]

export default function Features() {
  return (
    <section className="amanah-features" aria-labelledby="features-title">
      <div className="amanah-features__intro">
        <p className="amanah-features__eyebrow">The Amanah Foundation</p>

        <h2 id="features-title" className="amanah-features__title">
          Built for Our Members
        </h2>

        <p className="amanah-features__subtitle">
          A clear approach to saving together, investing responsibly
          and staying connected.
        </p>
      </div>

      <div className="amanah-features__grid">
        {features.map(({ icon: Icon, title, description }, index) => (
          <article key={title} className="amanah-feature">
            <div className="amanah-feature__top">
              <span className="amanah-feature__icon">
                <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              </span>

              <span className="amanah-feature__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 className="amanah-feature__title">{title}</h3>

            <p className="amanah-feature__description">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}