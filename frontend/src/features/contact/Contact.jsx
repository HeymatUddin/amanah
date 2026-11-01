import { useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  Mail,
  Users,
  ShieldCheck,
  Send,
} from 'lucide-react'
import './Contact.css'

// এখানে Amanah-এর আসল contact email বসাও।
const CONTACT_EMAIL = 'Send Email'

const topics = [
  'General enquiry',
  'Membership',
  'Contributions & shares',
  'Policies & governance',
  'Investment proposal',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: topics[0],
    message: '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!CONTACT_EMAIL) return

    const subject = `[Amanah] ${form.topic}`

    const body = [
      `Name: ${form.name.trim()}`,
      `Reply email: ${form.email.trim()}`,
      `Topic: ${form.topic}`,
      '',
      form.message.trim(),
    ].join('\n')

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="amanah-contact">
      <title>Contact | Amanah</title>

      <header className="amanah-contact__hero">
        <div className="amanah-contact__hero-content">
          <p className="amanah-contact__eyebrow">
            Get in Touch
          </p>

          <h1>
            Every Conversation
            <span>Starts with Trust.</span>
          </h1>

          <div
            className="amanah-contact__divider"
            aria-hidden="true"
          />

          <p className="amanah-contact__hero-description">
            Have a question about Amanah? Let’s talk about
            membership, shared savings or our principles.
          </p>
        </div>
      </header>

      <div className="amanah-contact__layout">
        <aside className="amanah-contact__sidebar">
          <div className="amanah-contact__intro">
            <p className="amanah-contact__label">
              We’re Here to Help
            </p>

            <h2>Let’s connect.</h2>

            <p>
              Whether you’re exploring membership or need
              clarity on a policy, start a conversation
              with the Amanah team.
            </p>
          </div>

          <section className="amanah-contact__card">
            <span className="amanah-contact__icon">
              <Mail size={23} aria-hidden="true" />
            </span>

            <h3>Email the Team</h3>

            <p>
              For general questions, proposals and
              membership enquiries.
            </p>

            {CONTACT_EMAIL ? (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="amanah-contact__text-link"
              >
                {CONTACT_EMAIL}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <p className="amanah-contact__unavailable">
                Email contact will be available soon.
              </p>
            )}
          </section>

          <section className="amanah-contact__card">
            <span className="amanah-contact__icon">
              <Users size={23} aria-hidden="true" />
            </span>

            <h3>Interested in Joining?</h3>

            <p>
              New members are admitted in January,
              subject to approval. Explore our membership
              rules before applying.
            </p>

            <Link
              to="/policy"
              className="amanah-contact__text-link"
            >
              Explore Our Policies
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </aside>

        <section
          className="amanah-contact__form-card"
          aria-labelledby="contact-form-title"
        >
          <div className="amanah-contact__form-heading">
            <p className="amanah-contact__label">
              Your Questions Matter
            </p>

            <h2 id="contact-form-title">
              Write to Amanah
            </h2>

            <p>
              Choose a topic and tell us how we can help.
            </p>
          </div>

          <form
            className="amanah-contact__form"
            onSubmit={handleSubmit}
          >
            <div className="amanah-contact__form-row">
              <div className="amanah-contact__field">
                <label htmlFor="contact-name">
                  Full name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="amanah-contact__field">
                <label htmlFor="contact-email">
                  Email address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={254}
                  required
                />
              </div>
            </div>

            <div className="amanah-contact__field">
              <label htmlFor="contact-topic">
                What is your enquiry about?
              </label>

              <select
                id="contact-topic"
                name="topic"
                value={form.topic}
                onChange={handleChange}
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div className="amanah-contact__field">
              <label htmlFor="contact-message">
                Your message
              </label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us a little about your question…"
                rows={7}
                value={form.message}
                onChange={handleChange}
                maxLength={2000}
                required
              />

              <span className="amanah-contact__character-count">
                {form.message.length}/2000
              </span>
            </div>

            <div className="amanah-contact__privacy">
              <ShieldCheck
                size={19}
                aria-hidden="true"
              />

              <p>
                Please avoid including passwords, bank
                details or sensitive financial documents.
              </p>
            </div>

            <button
              type="submit"
              className="amanah-contact__submit"
              disabled={!CONTACT_EMAIL}
              aria-describedby="contact-email-note"
            >
              Submit
              <Send size={17} aria-hidden="true" />
            </button>

            <p
              id="contact-email-note"
              className="amanah-contact__form-note"
            >
              {CONTACT_EMAIL
                ? 'Opens your email app with your message filled in. Review it and press Send there.'
                : 'Message enquiries will be available once our contact email is published.'}
            </p>
          </form>
        </section>
      </div>

      <section className="amanah-contact__bottom">
        <div>
          <h2>Clarity before commitment.</h2>

          <p>
            Learn how contributions, membership and
            collective decisions work at Amanah.
          </p>
        </div>

        <Link
          to="/policy"
          className="amanah-contact__bottom-link"
        >
          Read Our Policies
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}