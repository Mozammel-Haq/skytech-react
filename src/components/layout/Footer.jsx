import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi'
import NewsletterForm from '../forms/NewsletterForm.jsx'

const footerLinks = [
  {
    heading: 'Shop',
    links: [
      { label: 'Smartphones', to: '/shop?category=smartphones' },
      { label: 'Laptops', to: '/shop?category=laptops' },
      { label: 'Smart Home', to: '/shop?category=smart-home' },
      { label: 'Accessories', to: '/shop?category=accessories' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/about#careers' },
      { label: 'Press', to: '/about#press' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Track order', to: '/track-order' },
      { label: 'Returns', to: '/contact#returns' },
      { label: 'Warranty', to: '/about#warranty' },
      { label: 'FAQs', to: '/contact#faqs' },
    ],
  },
]

const socials = [
  { icon: FiFacebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: FiInstagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: FiYoutube, label: 'YouTube', href: 'https://youtube.com' },
  { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
]

function Footer({ darkMode = true }) {
  const bgClass = darkMode ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
  const borderClass = darkMode ? 'border-neutral-700' : 'border-neutral-200'
  const textMuted = darkMode ? 'text-white/70' : 'text-neutral-600'
  const linkHover = darkMode ? 'hover:text-primary/80' : 'hover:text-primary'

  return (
    <footer className={`mt-16 border-t ${borderClass} ${bgClass}`}>
      <div className="container grid gap-10 py-12 lg:grid-cols-[1.3fr,1fr]">
        <div className="space-y-6">
          <div>
            <Link to="/" className="flex items-center gap-3 text-2xl font-semibold">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-white font-black">
                ST
              </span>
              SkyTech
            </Link>
            <p className={`mt-4 max-w-md text-sm ${textMuted}`}>
              SkyTech curates flagship technology with concierge-level service. Every device is calibrated, protected, and ready for launch the moment it arrives.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.heading}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
                  {section.heading}
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${linkHover}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-neutral-800 p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Get first-in-line access</h3>
            <p className="mt-2 text-sm text-white/70">
              Join our priority list for limited drops, studio livestreams, and tech therapy sessions with our experts.
            </p>
            <div className="mt-4">
              <NewsletterForm darkMode />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${borderClass} text-white/70 transition hover:border-primary hover:bg-primary/10 hover:text-primary`}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={`border-t ${borderClass} py-6 text-sm text-white/70`}>
        <div className="container flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SkyTech Labs. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/legal/privacy" className={linkHover}>
              Privacy
            </Link>
            <Link to="/legal/terms" className={linkHover}>
              Terms
            </Link>
            <Link to="/sitemap" className={linkHover}>
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
