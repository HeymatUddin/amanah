import './Stats.css'

const stats = [
  {
    value: '5',
    label: 'Members',
    description: 'Saving together with a shared purpose',
  },
  {
    value: '8',
    label: 'Total Shares',
    description: 'Held across our current members',
  },
  {
    value: '1,500',
    label: 'Monthly Contribution',
    description: 'BDT per share, every month',
  },
  {
    value: '28,000',
    label: 'Annual Contribution',
    description: 'BDT per share, including two additional instalments',
  },
]

export default function Stats() {
  return (
    <section
      className="amanah-stats"
      aria-labelledby="amanah-stats-title"
    >
      <div className="amanah-stats__intro">
        <p className="amanah-stats__eyebrow">Our Community</p>

        <h2 id="amanah-stats-title" className="amanah-stats__title">
          Amanah at a Glance
        </h2>

        <p className="amanah-stats__subtitle">
          A small community. A structured commitment. A shared vision.
        </p>
      </div>

      <dl className="amanah-stats__grid">
        {stats.map(({ value, label, description }) => (
          <div key={label} className="amanah-stats__item">
            <dt className="amanah-stats__label">{label}</dt>
            <dd className="amanah-stats__value">{value}</dd>
            <dd className="amanah-stats__description">
              {description}
            </dd>
          </div>
        ))}
      </dl>

      <p className="amanah-stats__note">
        Contribution figures show scheduled amounts per share,
        not funds collected or investment returns.
      </p>
    </section>
  )
}