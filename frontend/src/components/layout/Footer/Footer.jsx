import { Link } from 'react-router'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="amanah-footer">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="amanah-footer__grid">
          <div>
            <Link to="/" className="amanah-footer__brand">
              <img
                src="/logo1.png"
                alt=""
                width="48"
                height="48"
              />
              <span>Amanah</span>
            </Link>

            <p className="amanah-footer__description">
              Shared savings. Shared purpose.
              <br />
              Built on trust, transparency and responsibility.
            </p>
          </div>

          <nav aria-label="Footer quick links">
            <h2 className="amanah-footer__heading">Quick Links</h2>

            <ul className="amanah-footer__links">
              <li><Link to="/about">About Amanah</Link></li>
              <li><Link to="/policy">Our Policy</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer member links">
            <h2 className="amanah-footer__heading">Membership</h2>

            <ul className="amanah-footer__links">
              <li><Link to="/login">Member Login</Link></li>
              <li><Link to="/become-a-member">Become a Member</Link></li>
            </ul>
          </nav>
        </div>

        <div className="amanah-footer__bottom">
          <p>
            © {new Date().getFullYear()} Amanah. All rights reserved.
          </p>
          <p>Together, with purpose.</p>
        </div>
      </div>
    </footer>
  )
}