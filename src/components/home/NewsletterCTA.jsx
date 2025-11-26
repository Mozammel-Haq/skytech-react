import NewsletterForm from '../forms/NewsletterForm.jsx'

function NewsletterCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-brand py-14 text-white">
      <div className="container relative z-10 grid gap-6 lg:grid-cols-[1.2fr,1fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Insider access
          </p>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Unlock early drops, concierge support, and surprise upgrades
          </h2>
          <p className="text-sm text-white/80 md:text-base">
            Join the SkyTech circle for limited releases, weeknight livestream demos, and curated bundles built around your gear.
          </p>
        </div>
        <NewsletterForm />
      </div>
      <div className="absolute inset-y-0 right-0 z-0 hidden w-1/3 bg-gradient-to-l from-white/20 to-transparent lg:block" aria-hidden />
    </section>
  )
}

export default NewsletterCTA