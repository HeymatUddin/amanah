import { Link } from 'react-router'
import {
  ArrowRight,
  Handshake,
  ShieldCheck,
  ClipboardCheck,
  Users,
} from 'lucide-react'
import './About.css'

const values = [
  {
    icon: Handshake,
    title: 'Trust',
    description:
      'Treating shared funds as an amanah, with honesty and care in every decision.',
  },
  {
    icon: ShieldCheck,
    title: 'Halal Principles',
    description:
      'Committing to lawful business activities and avoiding interest-based and prohibited investments.',
  },
  {
    icon: ClipboardCheck,
    title: 'Transparency',
    description:
      'Keeping clear, verifiable records so members can understand how funds are managed.',
  },
  {
    icon: Users,
    title: 'Shared Responsibility',
    description:
      'Working together through participation, collective decisions and accountability.',
  },
]

export default function About() {
  return (
    <div className="amanah-about">
      <title>About | Amanah</title>

      <section
        className="amanah-about__hero"
        aria-labelledby="about-title"
      >
        <p className="amanah-about__eyebrow">Our Story & Purpose</p>

        <h1 id="about-title">
          Friendship at the Beginning.
          <span>Shared Purpose for the Future.</span>
        </h1>

        <p className="amanah-about__hero-description">
          Amanah brings friends together to build disciplined savings
          and pursue halal investment opportunities through trust,
          cooperation and responsible decisions.
        </p>
      </section>

      <section
        className="amanah-about__story"
        aria-labelledby="about-story-title"
      >
        <div className="amanah-about__story-copy">
          <p className="amanah-about__eyebrow">Who We Are</p>
          <h2 id="about-story-title">A Community Built on Amanah</h2>

          <p>
            We began as five friends with a shared intention: to save
            consistently and put our combined resources towards
            meaningful opportunities.
          </p>

          <p>
            Today, our members hold eight shares in total. Our
            share-based approach gives each member a clear contribution
            commitment and a proportional stake in our collective
            financial journey.
          </p>

          <p>
            The name Amanah reflects the responsibility we place on
            ourselves—to handle shared funds faithfully, maintain
            transparent records and respect the trust of every member.
          </p>
        </div>

        <aside className="amanah-about__purpose">
          <span className="amanah-about__purpose-icon">
            <Handshake size={32} strokeWidth={1.5} aria-hidden="true" />
          </span>

          <h3>Our Purpose</h3>

          <p>
            To pool regular savings, explore halal ventures and build
            a lasting culture of financial discipline and mutual
            cooperation.
          </p>

          <div className="amanah-about__purpose-divider" />

          <span className="amanah-about__purpose-caption">
            Shared savings. Shared purpose.
          </span>
        </aside>
      </section>

      <section
        className="amanah-about__values"
        aria-labelledby="about-values-title"
      >
        <div className="amanah-about__section-heading">
          <p className="amanah-about__eyebrow">What Guides Us</p>
          <h2 id="about-values-title">Our Core Values</h2>
        </div>

        <div className="amanah-about__values-grid">
          {values.map(({ icon: Icon, title, description }) => (
            <article key={title} className="amanah-about__value">
              <span className="amanah-about__value-icon">
                <Icon
                  size={26}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </span>

              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="amanah-about__responsibility"
        aria-labelledby="about-responsibility-title"
      >
        <div>
          <p className="amanah-about__eyebrow">
            Growing Responsibly
          </p>

          <h2 id="about-responsibility-title">
            Clear Records. Collective Decisions.
          </h2>

          <p>
            Our framework calls for documented contributions,
            investment review, member oversight and controlled access
            to financial records. Investment outcomes may include
            profits or losses; returns are not guaranteed.
          </p>
        </div>

        <Link to="/policy" className="btn amanah-about__policy-link">
          Explore Our Policies
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}