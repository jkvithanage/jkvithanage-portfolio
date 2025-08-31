const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ errors: [{ message: "Method Not Allowed" }] });
  }

  try {
    const body = req.body || {};

    const {
      name = "",
      email = "",
      phone = "",
      subject = "New message from portfolio",
      message = "",
      website = "",
      formStartedAt,
      ["g-recaptcha-response"]: recaptchaToken,
      recaptchaToken: altRecaptchaToken,
    } = body;

    // Honeypot
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    // Time-to-submit
    const minMs = 10000;
    const started = Number.parseInt(
      formStartedAt || body["form-started-at"],
      10
    );
    if (!Number.isNaN(started)) {
      const elapsed = Date.now() - started;
      if (elapsed < minMs) {
        return res.status(400).json({
          errors: [{ message: "Please wait a couple seconds and try again." }],
        });
      }
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    const token = recaptchaToken || altRecaptchaToken || null;
    if (recaptchaSecret && token) {
      try {
        const params = new URLSearchParams({
          secret: recaptchaSecret,
          response: token,
        });
        const verifyRes = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
          }
        );
        const verifyJson = await verifyRes.json();
        console.log(verifyJson);
        if (!verifyJson.success) {
          return res.status(400).json({
            errors: [
              {
                message:
                  "reCAPTCHA verification failed. Please try again later.",
              },
            ],
          });
        }
      } catch (e) {
        return res.status(400).json({
          errors: [
            {
              message: "Unable to verify reCAPTCHA at this time.",
            },
          ],
        });
      }
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        errors: [
          {
            message: "Missing required fields: name, email, subject, message.",
          },
        ],
      });
    }

    const mailTo = process.env.MAIL_TO;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!mailTo || !smtpHost || !smtpUser || !smtpPass) {
      return res.status(500).json({
        errors: [
          {
            message:
              "Email service is not configured. Please set SMTP env vars.",
          },
        ],
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const text = `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#111;">
        <h2 style="margin:0 0 12px;">New message from portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${escapeHtml(
          message
        )}</pre>
      </div>
    `;

    const info = await transporter.sendMail({
      from: {
        name: "Portfolio Contact",
        address: smtpUser,
      },
      to: mailTo,
      subject: `[Portfolio] ${subject}`,
      text,
      html,
      replyTo: email || undefined,
    });

    // Success
    return res.status(200).json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errors: [
        {
          message: "An unexpected error occurred while sending the email.",
        },
      ],
    });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
