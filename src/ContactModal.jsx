import React, { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'

// Initialize EmailJS with your public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '')

export default function ContactModal({ isOpen, onClose }) {
  const [captcha, setCaptcha] = useState(false)  // checkbox state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setCaptcha(false)
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setErrors({})
      setSending(false)
      setStatus(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const validate = () => {
    const e = {}
    if (!name || name.trim().length === 0) e.name = 'Name is required'
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Valid email required'
    if (!message || message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    if (!captcha) e.captcha = 'Please confirm you are human'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSending(true)
    setStatus(null)
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          phone_number: phone || 'N/A',
          message: message
        }
      )
      setStatus({ ok: true, msg: 'Message sent successfully!' })
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setCaptcha(false)
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus({ ok: false, msg: err.message || 'Failed to send message' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact-modal-overlay" role="dialog" aria-modal="true">
      <div className="contact-modal">
        <div className="contact-header">
          <h3>Contact Us</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <p>Please confirm you're human by checking the box below, then send a short message and we'll reply.</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <label style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
              <input
                type="checkbox"
                checked={captcha}
                onChange={e => setCaptcha(e.target.checked)}
                style={{width:'1rem',height:'1rem'}}
              />
              <span>I am not a robot *</span>
            </label>
            {errors.captcha && <div className="field-error">{errors.captcha}</div>}
              <label>
                Name *
                <input value={name} onChange={e => setName(e.target.value)} required />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>

              <label>
                Email *
                <input value={email} onChange={e => setEmail(e.target.value)} required />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </label>

              <label>
                Phone
                <input value={phone} onChange={e => setPhone(e.target.value)} />
              </label>

              <label>
                Message *
                <textarea value={message} onChange={e => setMessage(e.target.value)} required minLength={10} />
                {errors.message && <div className="field-error">{errors.message}</div>}
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                <button type="submit" className="gallery-overlay-button" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" onClick={onClose} className="gallery-modal-button">Cancel</button>
              </div>

              {status && (
                <div style={{ marginTop: '0.5rem' }} className={status.ok ? 'success-msg' : 'field-error'}>
                  {status.msg}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
