import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import './Policy.css'

const policies = [
    {
        id: 'membership',
        number: '01',
        title: 'Membership & Agreement',
        description:
            'Membership, contributions and shared financial responsibility.',
        sections: [
            {
                title: 'Purpose & Principles',
                points: [
                    'Amanah brings members together to pool savings and pursue halal investment opportunities.',
                    'Trust, transparency, cooperation and financial accountability guide our activities.',
                    'Interest-based transactions, excessive uncertainty and prohibited business activities are excluded.',
                ],
            },
            {
                title: 'Shares & Contributions',
                points: [
                    'Each member holds one or more shares.',
                    'The monthly contribution is BDT 1,500 per share.',
                    'Two additional contributions of BDT 5,000 per share are required each year.',
                    'The total scheduled annual contribution is BDT 28,000 per share.',
                    'New members are admitted only in January, subject to approval.',
                    'Existing members may increase their shares only in January, subject to approval.',
                    'New members are not required to make an additional payment for savings or assets accumulated before joining.',
                ],
            },
            {
                title: 'Fund Management',
                points: [
                    'Funds are held in a designated financial account approved by the group.',
                    'Withdrawals or use of funds require approval from at least two authorised individuals, including the Treasurer and one Core Member.',
                    'Transactions must be documented, verifiable and accessible to members.',
                    'No individual may exercise unilateral control over shared funds.',
                ],
            },
            {
                title: 'Profit, Loss & Risk',
                points: [
                    'Profits and losses are allocated on a per-share basis.',
                    'No member is promised guaranteed returns or a fixed income.',
                    'Members acknowledge that investments carry risk and losses are possible.',
                    'Profits may be distributed or reinvested through a collective decision.',
                ],
            },
            {
                title: 'Exit & Dissolution',
                points: [
                    'A member wishing to leave must provide 30 days’ written notice.',
                    'Settlement depends on available liquidity and ongoing investments; payment may be deferred until funds become available.',
                    'Exit arrangements must protect the group’s financial stability.',
                    'Dissolution requires majority approval. Assets are liquidated, liabilities settled and remaining funds distributed per share.',
                    'Amendments to the membership agreement require approval from at least 70% of members.',
                ],
            },
        ],
    },
    {
        id: 'conduct',
        number: '02',
        title: 'Terms & Conditions',
        description:
            'Payment commitments, participation and member conduct.',
        sections: [
            {
                title: 'Payment & Late Fees',
                points: [
                    'Monthly contributions must be paid by the last calendar day of the relevant month.',
                    'A late fee of BDT 50 per share applies if the monthly contribution remains unpaid after the last calendar day of that month.',
                    'Payments and any applicable late fees must be recorded accurately.',
                    'Continued default may lead to a warning, suspension of rights and eventual removal under the governing rules.',
                ],
            },
            {
                title: 'Meetings & Participation',
                points: [
                    'Members are expected to attend monthly meetings and participate actively.',
                    'Absence from two consecutive meetings results in a formal warning.',
                    'Absence from three meetings may lead to suspension of voting rights and further review.',
                    'Members should communicate any difficulty meeting their contribution or participation commitments.',
                ],
            },
            {
                title: 'Conduct & Confidentiality',
                points: [
                    'Members must act honestly, respectfully and transparently.',
                    'Fraud, misuse of funds and intentional deception may result in immediate suspension, investigation and removal if proven.',
                    'Financial records, investment strategies and internal discussions must not be disclosed externally without authorisation.',
                    'Only approved document versions and formally recognised communication channels govern official decisions.',
                ],
            },
        ],
    },
    {
        id: 'investment',
        number: '03',
        title: 'Investment Policy',
        description:
            'Investment screening, collective approvals and risk controls.',
        sections: [
            {
                title: 'Permitted & Prohibited Activities',
                points: [
                    'Investments must involve lawful, real economic activity and follow the group’s halal principles.',
                    'Potential areas include businesses, trading, services and tangible or asset-backed opportunities.',
                    'Interest-based activities, gambling, alcohol, pork-related industries, fraudulent schemes and excessive uncertainty are prohibited.',
                    'Any non-compliant investment must be reviewed and corrective action taken.',
                ],
            },
            {
                title: 'Proposals & Approval',
                points: [
                    'A formal proposal must describe the opportunity, required capital, estimated returns, risks, duration and exit strategy.',
                    'Proposals require evaluation by a competent expert.',
                    'Investment approval requires at least four Core Members.',
                    'When General Members are present in the membership, approval from more than 50% of all General Members is also required.',
                    'When there are no General Members, approval from at least four Core Members is sufficient.',
                    'Investment decisions and their approvals must be documented.',
                ],
            },
            {
                title: 'Risk & Exposure Limits',
                points: [
                    'Exposure to a single investment must not exceed 30% of Amanah’s total fund.',
                    'The total fund includes both available funds and funds already invested.',
                    'A minimum liquidity reserve of 10% must be maintained.',
                    'High-risk investments require the consent of all members.',
                    'Investments should be diversified where feasible.',
                ],
            },
            {
                title: 'Conflicts of Interest',
                points: [
                    'Members must disclose any personal or financial interest in a proposed investment.',
                    'A member with a conflict of interest must abstain from discussion and voting on that proposal.',
                    'Investment decisions must prioritise the collective interests of Amanah.',
                ],
            },
            {
                title: 'Monitoring & Profits',
                points: [
                    'Investment performance and financial updates must be recorded and reviewed regularly.',
                    'Reports are shared with members.',
                    'Profits may be distributed per share or reinvested through a collective decision.',
                    'Actual outcomes must be assessed against the investment proposal and recorded transparently.',
                ],
            },
        ],
    },
    {
        id: 'accounting',
        number: '04',
        title: 'Accounting & Records',
        description:
            'Verifiable payments, regular reporting and controlled access.',
        sections: [
            {
                title: 'Contribution Records',
                points: [
                    'Contribution records must include the payment date, amount, member and shares covered.',
                    'Payments require verifiable proof, such as a payment screenshot, receipt or written confirmation.',
                    'Monthly contributions, additional annual contributions and late fees must be recorded separately.',
                    'Members should report missing or incorrect payment entries promptly.',
                ],
            },
            {
                title: 'Transaction & Investment Records',
                points: [
                    'Transaction logs must record the date, amount, purpose and approval authority.',
                    'Investment records must include capital, dates, project details, estimated outcomes and actual performance.',
                    'Records must show accumulated funds, available cash and invested amounts.',
                    'Supporting documents must be retained with the relevant financial records.',
                ],
            },
            {
                title: 'Reporting & Review',
                points: [
                    'Monthly financial reports and quarterly summaries are shared with members.',
                    'A monthly internal audit is required; an external review may be arranged when necessary.',
                    'Discrepancies must be investigated and resolved promptly.',
                    'Corrections must be documented so that the history of financial records remains understandable.',
                ],
            },
            {
                title: 'Access & Security',
                points: [
                    'Members have the right to view financial records.',
                    'Only authorised individuals may edit records.',
                    'Records must be stored securely, protected against unauthorised changes and backed up regularly.',
                    'Falsification or concealment of financial information is treated as serious misconduct.',
                    'Access to internal financial records does not authorise disclosure outside Amanah.',
                ],
            },
        ],
    },
    {
        id: 'governance',
        number: '05',
        title: 'Governance & Disputes',
        description:
            'Member roles, voting, oversight and dispute resolution.',
        sections: [
            {
                title: 'Membership Structure',
                points: [
                    'The five founding members are Core Members.',
                    'New members join as General Members.',
                    'Core Members oversee operations, financial management and policy compliance.',
                    'All members must follow Amanah’s approved rules and decisions.',
                ],
            },
            {
                title: 'Roles & Authority',
                points: [
                    'Roles may include Coordinator, Treasurer and Record Keeper, with rotation by mutual agreement.',
                    'Responsibilities must be clearly assigned and carried out accountably.',
                    'No individual has unilateral control over funds or decisions.',
                    'Major decisions must be recorded securely and made accessible to members.',
                ],
            },
            {
                title: 'Voting & Decisions',
                points: [
                    'Each member has one vote, regardless of the number of shares held.',
                    'Standard decisions require more than 50% approval of participating members.',
                    'At least 50% of total members must be present or represented for a valid decision.',
                    'Investment decisions follow the separate approval requirements in the Investment Policy.',
                    'High-risk investments require the consent of all members.',
                    'Core Members resolve tied votes and document the outcome.',
                    'Necessary emergency decisions must be documented and communicated within 48 hours.',
                ],
            },
            {
                title: 'Dispute Resolution',
                points: [
                    'Members should first attempt to resolve disputes through respectful internal discussion.',
                    'Unresolved disputes proceed to mediation by Core Members.',
                    'If mediation does not resolve the matter, it proceeds to a majority member decision.',
                    'The issue, discussion and final decision must be documented.',
                ],
            },
            {
                title: 'Removal & Appeals',
                points: [
                    'Removal requires Core Member approval and majority member agreement.',
                    'Members may submit a formal appeal to Core Members for review.',
                    'An appeal may lead to re-evaluation through voting.',
                    'Decisions and appeal outcomes must be recorded and communicated to the affected member.',
                ],
            },
        ],
    },
]

export default function Policy() {
    const [activeTab, setActiveTab] = useState('membership')

    function handleTabKeyDown(event, index) {
        let nextIndex

        switch (event.key) {
            case 'ArrowRight':
                nextIndex = (index + 1) % policies.length
                break
            case 'ArrowLeft':
                nextIndex = (index - 1 + policies.length) % policies.length
                break
            case 'Home':
                nextIndex = 0
                break
            case 'End':
                nextIndex = policies.length - 1
                break
            default:
                return
        }

        event.preventDefault()
        setActiveTab(policies[nextIndex].id)

        event.currentTarget.parentElement
            .querySelectorAll('[role="tab"]')[nextIndex]
            .focus()
    }

    return (
        <div className="amanah-policy">
            <title>Policy | Amanah</title>

            <header className="amanah-policy__hero">
                <div className="amanah-policy__hero-content">
                    <p className="amanah-policy__eyebrow">
                        The Amanah Framework
                    </p>

                    <h1>
                        Built on Trust.
                        <span>Guided by Principles.</span>
                    </h1>

                    <div
                        className="amanah-policy__hero-divider"
                        aria-hidden="true"
                    />

                    <p className="amanah-policy__hero-description">
                        Clear commitments for how we save, invest and
                        move forward together.
                    </p>
                </div>
            </header>
            <div
                className="amanah-policy__tabs"
                role="tablist"
                aria-label="Policy categories"
            >
                {policies.map(({ id, title }, index) => (
                    <button
                        key={id}
                        id={`policy-tab-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === id}
                        aria-controls={`policy-panel-${id}`}
                        tabIndex={activeTab === id ? 0 : -1}
                        className="amanah-policy__tab"
                        onClick={() => setActiveTab(id)}
                        onKeyDown={(event) =>
                            handleTabKeyDown(event, index)
                        }
                    >
                        {title}
                    </button>
                ))}
            </div>

            <div className="amanah-policy__panels">
                {policies.map(
                    ({ id, number, title, description, sections }) => (
                        <section
                            key={id}
                            id={`policy-panel-${id}`}
                            role="tabpanel"
                            aria-labelledby={`policy-tab-${id}`}
                            tabIndex={0}
                            hidden={activeTab !== id}
                            className="amanah-policy__panel"
                        >
                            <header className="amanah-policy__panel-heading">
                                <span className="amanah-policy__number">
                                    {number}
                                </span>

                                <div className="amanah-policy__panel-copy">
                                    <h2>{title}</h2>
                                    <p>{description}</p>
                                </div>
                            </header>

                            <div className="amanah-policy__body">
                                {sections.map(
                                    ({ title: sectionTitle, points }) => (
                                        <section
                                            key={sectionTitle}
                                            className="amanah-policy__section"
                                        >
                                            <h3>{sectionTitle}</h3>

                                            <ul>
                                                {points.map((point) => (
                                                    <li key={point}>{point}</li>
                                                ))}
                                            </ul>
                                        </section>
                                    ),
                                )}
                            </div>
                        </section>
                    ),
                )}
            </div>

            <section className="amanah-policy__contact">
                <div>
                    <h2>Need help understanding a policy?</h2>

                    <p>
                        Contact the team before making a membership
                        commitment.
                    </p>
                </div>

                <Link
                    to="/contact"
                    className="amanah-policy__button"
                >
                    Contact Us
                    <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </section>
        </div>
    )
}