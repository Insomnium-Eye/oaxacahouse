import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' })
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' })
    }

    const toEnv = process.env.TO_EMAILS
    if (!toEnv) return res.status(500).json({ error: 'Recipient emails not configured on server' })
    const toAddrs = toEnv.split(',').map(s => s.trim()).filter(Boolean)
    if (toAddrs.length === 0) return res.status(500).json({ error: 'No recipient addresses configured' })

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toAddrs,
      subject: `Website contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || ''}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`
    }

    await transporter.sendMail(mailOptions)

    return res.json({ message: 'Email sent' })
  } catch (err) {
    console.error('send-email error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
})

app.listen(PORT, () => {
  console.log(`Email server listening on http://localhost:${PORT}`)
})
