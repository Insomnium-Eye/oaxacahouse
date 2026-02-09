import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import './styles/site.css'
import './App.css'
import { Helmet } from 'react-helmet'
import Gallery from './Gallery'

export default function App() {
    const { t, i18n } = useTranslation()

    const modules = useMemo(
        () =>
            import.meta.glob('./img/*.{jpg,jpeg,png,webp,svg}', { eager: true }),
        []
    )

    const images = useMemo(() => {
        return Object.keys(modules)
            .map((k) => {
                const mod = modules[k]
                // Handle both ESM default export and direct export
                const src = (mod && (mod.default || mod)) || ''
                // Extract just the filename (e.g. "OaxacaPicture_21.jpg")
                const name = k.split('/').pop()
                return { src, name }
            })
            .filter((img) => img.src)
            // --- THIS IS THE NEW SORTING LOGIC ---
            .sort((a, b) => {
                // Extract the first number found in the filename
                const getNumber = (str) => {
                    const match = str.match(/(\d+)/)
                    return match ? parseInt(match[0], 10) : 0
                }

                const numA = getNumber(a.name)
                const numB = getNumber(b.name)

                // Return B - A for Descending (21, 20, 19...)
                return numB - numA
            })
    }, [modules])

    return (
        <div id="app-root" style={{ height: '100vh', margin: 0 }}>
            <Helmet>
                <html lang={i18n.language} />
                <title>{t('site.title')}</title>
                <meta name="description" content={t('site.description')} />
                <meta property="og:title" content={t('site.title')} />
                <meta property="og:description" content={t('site.description')} />
                <meta property="og:type" content="website" />
            </Helmet>

            <main id="main-root" style={{ height: '100%' }}>
                <Gallery images={images} galleryLabel={t('site.gallery')} />
            </main>
        </div>
    )
}