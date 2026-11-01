import { Link } from 'react-router'
import './FAQ.css'

const questions = [
  {
    question: 'How does the share system work?',
    answer:
      'Members contribute according to the number of shares they hold. Each share has the same scheduled contribution requirements.',
  },
  {
    question: 'How much do I contribute per share?',
    answer:
      'Each share requires BDT 1,500 every month and two additional contributions of BDT 5,000 each year. The total annual contribution is BDT 28,000 per share.',
  },
  {
    question: 'When can new members join?',
    answer:
      'New members are admitted in January. Membership applications are subject to review and approval.',
  },
  {
    question: 'How can I apply for membership?',
    answer:
      'Use the Become a Member page to access membership application information. Submitting an application does not automatically confirm membership.',
  },
  {
    question: 'How can I view my contribution records?',
    answer:
      'Once member access is available, approved members will be able to log in and view their contribution history and outstanding dues.',
  },
  {
    question: 'What investment principles does Amanah follow?',
    answer:
      'Amanah is committed to halal investment practices, transparent records and responsible decision-making. Investment opportunities are considered in line with these principles.',
  },
]

export default function FAQ() {
  return (
    <section className="amanah-faq" aria-labelledby="faq-title">
      <div className="amanah-faq__intro">
        <p className="amanah-faq__eyebrow">Your Questions, Answered</p>

        <h2 id="faq-title" className="amanah-faq__title">
          Frequently Asked Questions
        </h2>

        <p className="amanah-faq__subtitle">
          A little clarity before you take the next step.
        </p>
      </div>

      <div className="amanah-faq__list">
        {questions.map(({ question, answer }) => (
          <details
            key={question}
            className="collapse collapse-plus amanah-faq__item"
          >
            <summary className="collapse-title amanah-faq__question">
              {question}
            </summary>

            <div className="collapse-content amanah-faq__answer">
              <p>{answer}</p>
            </div>
          </details>
        ))}
      </div>

      <p className="amanah-faq__contact">
        Still have a question?{' '}
        <Link to="/contact">Contact us</Link>
      </p>
    </section>
  )
}