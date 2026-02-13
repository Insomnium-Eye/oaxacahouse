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
        // 1. Create the list of images
        const list = Object.keys(modules)
            .map((k) => {
                const mod = modules[k]
                const src = (mod && (mod.default || mod)) || ''
                const name = k.split('/').pop()
                return { src, name }
            })
            .filter((img) => img.src)

        // 2. SORT the list (Ascending numeric order)
        list.sort((a, b) => {
            // Find the number inside the filename (e.g. "OaxacaPicture_21.jpg" -> 21)
            const getNumber = (str) => {
                const match = str.match(/(\d+)/)
                return match ? parseInt(match[0], 10) : 0
            }

            const numA = getNumber(a.name)
            const numB = getNumber(b.name)

            // Return numA - numB for Ascending Order (1, 2, 3...)
            return numA - numB
        })
        
        // Debug: Check your console (F12) to see the final order
        console.log('Gallery Order:', list.map(i => i.name))

        return list
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