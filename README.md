<h1 align="center">www.jkvithanage.com - My Portfolio Website</h1>

![jkvithanage](https://github.com/jkvithanage/jkvithanage-portfolio/assets/6828858/8c29d85b-54f2-468a-8209-c9064adc80da)

---

- Built with HTML, SCSS and JavaScript.
- In terms of style, My goal was to do something simple and minimal. I used flat square-shaped elements throughout the design, avoiding rounded shapes as much as possible.

---

#### Update 30/08/2025

Replaced Formspree for contact form submission with a serverless function (`/api/send-email`) using Nodemailer.
<br>The following environment variables needs to be added in Vercel:

- `SMTP_HOST`: SMTP server host (eg: `smtp.gmail.com`).
- `SMTP_PORT`: SMTP server port (`465` for SSL or `587` for TLS).
- `SMTP_USER`: SMTP username (your email address).
- `SMTP_PASS`: SMTP password (for Gmail, use an App Password).
- `MAIL_TO`: Destination email address.
- `RECAPTCHA_SECRET`: Legacy reCAPTCHA secret key.
