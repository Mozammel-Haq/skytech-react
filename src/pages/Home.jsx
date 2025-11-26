import { Helmet } from 'react-helmet-async'
import HomePageSections from '../components/home/HomePageSections.jsx'

function Home() {
  return (
    <>
      <Helmet>
        <title>SkyTech — Flagship Tech Curated for You</title>
        <meta
          name="description"
          content="Discover SkyTech flagship devices: smartphones, creator laptops, smart home, and audio ecosystems curated for premium experiences."
        />
        <meta property="og:title" content="SkyTech — Flagship Tech Curated for You" />
        <meta
          property="og:description"
          content="Explore best-in-class tech with concierge service, limited drops, and ready-to-launch bundles."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <HomePageSections />
    </>
  )
}

export default Home
