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
                <section className="property-description" aria-label="Property Description">
                    <div className="desc-inner">
                        <h2>Exclusive Property for Sale</h2>
                        
                        <div className="location">
                            <p><strong>San Felipe del Agua, Oaxaca, Mexico</strong></p>
                            <p>Situated in the most exclusive and desirable area of Oaxaca, this traditional Mexican estate offers timeless elegance and unparalleled privacy.</p>
                        </div>

                        <div className="columns">
                            <div className="column-section">
                                <h3>The Estate</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>Lot Size</strong>
                                        <p>1,065.04 m² of beautifully landscaped grounds</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Main Residence</strong>
                                        <p>301.04 m² of traditional Mexican architecture with distinctive red adobe finishes</p>
                                    </div>
                                </div>

                                <h3>Main House</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>3 Spacious Bedrooms</strong>
                                        <p>Each with its own en-suite bathroom</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Traditional Mexican Kitchen</strong>
                                        <p>Custom wooden cabinetry, built-in pantry storage, and authentic design</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Living & Dining Areas</strong>
                                        <p>Open-concept spaces with built-in wooden furniture and bookcases</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Signature Experiences</strong>
                                        <p>Stargazing bathtub with retractable roof • Indoor/outdoor fish fountain • Large covered verandas with guest bath</p>
                                    </div>
                                </div>
                            </div>

                            <div className="column-section">
                                <h3>Guest Bungalows</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>2 Private Bungalows</strong>
                                        <p>Each with en-suite bathroom, private veranda, and garden area</p>
                                    </div>
                                </div>

                                <h3>Amenities & Features</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <strong>Lush Gardens</strong>
                                        <p>Mango, Guava, Avocado, Lemon, and Eucalyptus trees • Tree-lined walkways and multiple verandas</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Parking</strong>
                                        <p>Space for up to 7 vehicles</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Water System</strong>
                                        <p>Dual cistern: 10,000L main supply + 6,000L rainwater harvesting</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Security</strong>
                                        <p>Comprehensive camera system • Electrified perimeter fence</p>
                                    </div>
                                    <div className="feature-item">
                                        <strong>Utilities</strong>
                                        <p>Dedicated laundry room</p>
                                    </div>
                                </div>

                                <div className="note">
                                    <p><em>Available furnished or unfurnished, based on buyer preference</em></p>
                                    <button 
                                        className="gallery-modal-button"
                                        onClick={() => setIsModalOpen(true)}
                                        aria-label="View full gallery"
                                    >
                                        View Full Gallery
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