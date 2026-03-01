Contact Feature Setup

Overview
The contact modal uses **EmailJS** to send emails directly from the browser. A simple "I am not a robot" checkbox is included in the form to prevent automated submissions; when checked the user can submit their name, email, phone and message. This approach works seamlessly on GitHub Pages (static hosting) without requiring a backend server.

EmailJS handles the SMTP connection and sends emails to two Gmail accounts you configure.

Quick Setup
1. Sign up for a free account at https://www.emailjs.com/
2. Copy `.env.local.example` to `.env.local` and fill in your EmailJS credentials.
3. Install dependencies:
```bash
npm install
```
4. Start development:
```bash
npm run dev
```

Detailed EmailJS Setup
1. Go to https://www.emailjs.com/ and sign up (free tier is sufficient).
2. In the dashboard:
   - Create a new Gmail service (or connect your existing Gmail account).
   - Create an email template with placeholder variables: `{{from_name}}`, `{{from_email}}`, `{{phone_number}}`, `{{message}}`.
   - Note your Service ID, Template ID, and Public Key.
3. In the template, set the "To Email" to receive emails at both Gmail addresses:
   - EmailJS templates support multiple recipients via comma-separated addresses in the "To Email" field, or you can use a template variable.
4. Copy `.env.local.example` to `.env.local` and fill:
   ```
   VITE_EMAILJS_PUBLIC_KEY=xxx
   VITE_EMAILJS_SERVICE_ID=yyy
   VITE_EMAILJS_TEMPLATE_ID=zzz
   ```
5. Test locally with `npm run dev`, fill the contact form, and verify email arrives.

Production (GH Pages)
Before deploying:
1. Ensure `.env.local` is in `.gitignore` (do NOT commit secrets).
2. In GitHub repository Settings → Secrets and Variables → Actions, add three secrets:
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
3. Update your deployment workflow to inject these as environment variables during the build.

Example workflow fragment:
```yaml
env:
  VITE_EMAILJS_PUBLIC_KEY: ${{ secrets.VITE_EMAILJS_PUBLIC_KEY }}
  VITE_EMAILJS_SERVICE_ID: ${{ secrets.VITE_EMAILJS_SERVICE_ID }}
  VITE_EMAILJS_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_TEMPLATE_ID }}
```

Files
- `src/ContactModal.jsx` – Contact form modal, validation, EmailJS integration.
- `src/App.jsx` – Floating "Contact Us" button and modal state.
- `src/App.css` – Modal and form styles.
- `.env.local.example` – Template for environment variables (copy to `.env.local`).

