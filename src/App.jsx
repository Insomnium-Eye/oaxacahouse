import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'
import './styles/site.css'
import './App.css'
import { Helmet } from 'react-helmet'
import Gallery from './Gallery'
import GalleryModal from './GalleryModal'

export default function App() {
    const { t, i18n } = useTranslation()
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                
                {/* Home / Close button (top-left) - only show when modal is open */}
                {isModalOpen && (
                    <div className="home-button">
                        <button
                            onClick={() => {
                                if (isModalOpen) setIsModalOpen(false)
                                else window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            aria-label="Close modal or go home"
                            title="Close / Home"
                        >
                            ⤺
                        </button>
                    </div>
                )}

                {/* Language Switcher */}
                <div className="language-switcher">
                    <button
                        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                        onClick={() => i18n.changeLanguage('en')}
                        title="English"
                    >
                        EN
                    </button>
                    <span className="lang-separator">/</span>
                    <button
                        className={`lang-btn ${i18n.language === 'es' ? 'active' : ''}`}
                        onClick={() => i18n.changeLanguage('es')}
                        title="Español"
                    >
                        ES
                    </button>
                </div>
                <section className="property-description" aria-label="Property Description">
                    <div className="desc-inner">
                        <h2>{t('property.title')}</h2>
                        
                        <div className="location">
                            <p><strong>{t('property.location_heading')}</strong></p>
                            <p>{t('property.location_description')}</p>
                        </div>

                        <div className="columns">
                            <div className="column-section">
                                <h3>{t('property.estate_heading')}</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>{t('property.lot_size')}</strong>
                                        <p>{t('property.lot_size_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.main_residence')}</strong>
                                        <p>{t('property.main_residence_desc')}</p>
                                    </div>
                                </div>

                                <h3>{t('property.main_house_heading')}</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>{t('property.bedrooms')}</strong>
                                        <p>{t('property.bedrooms_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.kitchen')}</strong>
                                        <p>{t('property.kitchen_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.living_dining')}</strong>
                                        <p>{t('property.living_dining_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.signature')}</strong>
                                        <p>{t('property.signature_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="column-section">
                                <h3>{t('property.guest_bungalows_heading')}</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>{t('property.bungalows')}</strong>
                                        <p>{t('property.bungalows_desc')}</p>
                                    </div>
                                </div>

                                <h3>{t('property.amenities_heading')}</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>{t('property.gardens')}</strong>
                                        <p>{t('property.gardens_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.parking')}</strong>
                                        <p>{t('property.parking_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.water')}</strong>
                                        <p>{t('property.water_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.security')}</strong>
                                        <p>{t('property.security_desc')}</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>{t('property.utilities')}</strong>
                                        <p>{t('property.utilities_desc')}</p>
                                    </div>
                                </div>

                                <div className="note">
                                    <p><em>{t('property.note')}</em></p>
                                    <button 
                                        className="gallery-modal-button"
                                        onClick={() => setIsModalOpen(true)}
                                        aria-label="View full gallery"
                                    >
                                        {t('property.view_gallery')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <GalleryModal 
                images={images}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                galleryLabel={t('site.gallery')}
            />
        </div>
    )
}