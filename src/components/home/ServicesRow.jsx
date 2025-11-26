import { FiTruck, FiRefreshCw, FiHeadphones, FiShield } from 'react-icons/fi'

const services = [
  {
    icon: FiTruck,
    title: 'Free delivery',
    description: 'Complimentary express shipping on orders over $50 across the continental US.',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy returns',
    description: '30-day returns with instant credit option and pickup scheduling support.',
  },
  {
    icon: FiHeadphones,
    title: '24/7 support',
    description: 'Dedicated SkyTech concierges reachable via chat, voice, or video walkthroughs.',
  },
  {
    icon: FiShield,
    title: 'Extended warranty',
    description: 'Upgrade to SkyShield plans for accidental coverage and instant device swaps.',
  },
]

function ServicesRow() {
  return (
    <section className="bg-neutral-900 py-12 text-white">
      <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <article
            key={service.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-subtle transition hover:-translate-y-1 hover:bg-white/10"
          >
            <service.icon className="text-2xl text-primary" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm text-neutral-200">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ServicesRow
