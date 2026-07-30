import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import useTheme from './hooks/useTheme'
import useSettings from './hooks/useSettings'

// ── Critical path ─────────────────────────────────────────────────────────────
import Navbar from './sections/Navbar'
import Hero   from './sections/Hero'

// ── Below-the-fold: lazy loaded ───────────────────────────────────────────────
const Services     = lazy(() => import('./sections/Services'))
const Projects     = lazy(() => import('./sections/Projects'))
const TechStack    = lazy(() => import('./sections/TechStack'))
const About        = lazy(() => import('./sections/About'))
const Timeline     = lazy(() => import('./sections/Timeline'))
const Certificates = lazy(() => import('./sections/Certificates'))
const Blog         = lazy(() => import('./sections/Blog'))
const Contact      = lazy(() => import('./sections/Contact'))
const Footer       = lazy(() => import('./sections/Footer'))

function SectionSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-custom space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-white/5 rounded-full mx-auto" />
        <div className="h-10 w-64 bg-white/5 rounded-xl mx-auto" />
        <div className="h-px w-48 bg-white/5 rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { theme, toggle } = useTheme()
  const { settings }      = useSettings()
  const isLight = theme === 'light'

  const siteTitle  = settings?.seoTitle       || 'Gebremeskel Kiflemeskel | Full Stack Developer'
  const siteDesc   = settings?.seoDescription || 'Full Stack Web Developer from Ethiopia building modern, performant web applications with React, Node.js, and MongoDB.'
  const siteUrl    = 'https://mypersonal-portfolio-gm.vercel.app'
  const faviconUrl = settings?.favicon        || '/favicon.svg'
  const siteTagline = settings?.siteTitle     || siteTitle

  return (
    <>
      {/* ── Global SEO & Open Graph ────────────────────────────────────────── */}
      <Helmet>
        <title>{siteTagline}</title>
        {/* Dynamic favicon from admin settings */}
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <meta name="description" content={siteDesc} />
        <meta name="keywords"    content={(settings?.seoKeywords ?? ['full stack developer','react','node.js','ethiopia']).join(', ')} />
        <meta name="author"      content="Gebremeskel Kiflemeskel" />
        <meta name="robots"      content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={siteUrl} />
        <meta property="og:title"       content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:image"       content={`${siteUrl}/og-image.png`} />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={siteTitle} />
        <meta name="twitter:description" content={siteDesc} />
        <meta name="twitter:image"       content={`${siteUrl}/og-image.png`} />

        {/* Structured Data — Person */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type':    'Person',
          name:       'Gebremeskel Kiflemeskel',
          url:        siteUrl,
          jobTitle:   'Full Stack Web Developer',
          worksFor:   { '@type': 'Organization', name: 'Freelance' },
          address:    { '@type': 'PostalAddress', addressCountry: 'ET' },
          sameAs: [
            settings?.socials?.github   || 'https://github.com/Tibeb93',
            settings?.socials?.linkedin || 'https://linkedin.com',
          ],
        })}</script>
      </Helmet>

      <div className={`min-h-screen overflow-x-hidden transition-colors duration-300
        ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#0B0F19] text-slate-200'}`}>

        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[80px]
            ${isLight ? 'bg-violet-400/10' : 'bg-violet-600/10'}`} />
          <div className={`absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[80px]
            ${isLight ? 'bg-pink-400/8' : 'bg-pink-600/8'}`} />
          <div className={`absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-[80px]
            ${isLight ? 'bg-orange-400/8' : 'bg-orange-600/8'}`} />
        </div>

        <div className="relative z-10">
          <Navbar theme={theme} toggleTheme={toggle} />

          <main>
            {/* Order matches navbar: Home → About → Projects → Skills → Blog → Contact */}
            {/* Additional sections (Services, Timeline, Certificates) sit between their logical neighbors */}
            <Hero />
            <Suspense fallback={<SectionSkeleton />}><About /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Services /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Projects /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><TechStack /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Timeline /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Certificates /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Blog /></Suspense>
            <Suspense fallback={<SectionSkeleton />}><Contact /></Suspense>
          </main>

          <Suspense fallback={null}><Footer /></Suspense>
        </div>
      </div>
    </>
  )
}
