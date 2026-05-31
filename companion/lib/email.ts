import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Companion by Danè <noreply@companionai.coach>'
const BASE_URL = 'https://companionai.coach'

// ---------------------------------------------------------------------------
// Shared layout primitives
// ---------------------------------------------------------------------------

const LOGO = `
  <table cellpadding="0" cellspacing="0" border="0" role="presentation">
    <tr>
      <td style="vertical-align:middle;padding-right:10px;">
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M38 16.5C35.2 10.5 29 7 22 7C12.6 7 5 14.6 5 24C5 33.4 12.6 41 22 41C29 41 35.2 37.5 38 31.5"
            stroke="white" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <path d="M30 20L32 24L30 28L28 24Z" fill="#B9A7E6"/>
          <path d="M33.5 17L35.5 21.5L33.5 26L31.5 21.5Z" fill="#FF6F9F" opacity="0.9"/>
          <circle cx="29.5" cy="24" r="1.4" fill="#FF6F9F"/>
        </svg>
      </td>
      <td style="vertical-align:middle;">
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700;font-size:15px;letter-spacing:-0.02em;color:#ffffff;line-height:1.1;">Companion</div>
        <div style="font-family:Georgia,serif;font-style:italic;font-size:11px;color:#FF6F9F;line-height:1.2;">by Danè</div>
      </td>
    </tr>
  </table>`

function header(): string {
  return `
    <tr>
      <td style="background:linear-gradient(135deg,#2E1A47 0%,#4B2E83 100%);padding:28px 36px;border-radius:16px 16px 0 0;">
        ${LOGO}
      </td>
    </tr>`
}

function footer(): string {
  return `
    <tr>
      <td style="background:#F6F3FB;padding:24px 36px;border-radius:0 0 16px 16px;border-top:1px solid #E8E1F7;">
        <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#9B93A8;margin:0 0 6px 0;line-height:1.6;">
          You received this email because you have an account at
          <a href="${BASE_URL}" style="color:#7E64B5;text-decoration:none;">companionai.coach</a>.
        </p>
        <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#9B93A8;margin:0 0 6px 0;line-height:1.6;">
          <a href="${BASE_URL}/portal/account" style="color:#7E64B5;text-decoration:underline;">Manage email preferences</a>
          &nbsp;·&nbsp;
          <a href="${BASE_URL}/privacy" style="color:#7E64B5;text-decoration:underline;">Privacy Policy</a>
          &nbsp;·&nbsp;
          <a href="${BASE_URL}/portal/account" style="color:#7E64B5;text-decoration:underline;">Unsubscribe</a>
        </p>
        <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#BDB6C5;margin:0;line-height:1.6;">
          POPIA: Your personal data is handled with care and consent. Companion by Danè is a coaching service,
          not therapy or emergency support.
        </p>
      </td>
    </tr>`
}

function button(label: string, href: string, bg = '#4B2E83'): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:4px 0;">
      <tr>
        <td style="background:${bg};border-radius:999px;padding:13px 28px;">
          <a href="${href}" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;display:inline-block;letter-spacing:-0.01em;">${label}</a>
        </td>
      </tr>
    </table>`
}

function wrap(bodyRows: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#F6F3FB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#F6F3FB;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(46,26,71,0.10);">
          ${header()}
          ${bodyRows}
          ${footer()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function bodyCell(content: string): string {
  return `
    <tr>
      <td style="padding:32px 36px 28px 36px;">
        ${content}
      </td>
    </tr>`
}

function h1(text: string): string {
  return `<h1 style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;font-weight:700;color:#2E1A47;margin:0 0 8px 0;letter-spacing:-0.04em;line-height:1.2;">${text}</h1>`
}

function p(text: string, style = ''): string {
  return `<p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#6E667A;margin:0 0 16px 0;line-height:1.65;${style}">${text}</p>`
}

function infoCard(rows: Array<[string, string]>): string {
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#9B93A8;padding:10px 0;border-bottom:1px solid #E8E1F7;width:110px;vertical-align:top;">${label}</td>
      <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#2E1A47;padding:10px 0;border-bottom:1px solid #E8E1F7;vertical-align:top;">${value}</td>
    </tr>`).join('')
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background:#F6F3FB;border-radius:12px;padding:4px 20px;margin:16px 0;">
      <tbody>${rowsHtml}</tbody>
    </table>`
}

function divider(): string {
  return `<div style="height:1px;background:#E8E1F7;margin:20px 0;"></div>`
}

// ---------------------------------------------------------------------------
// A) Welcome email
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(to: string, firstName: string) {
  const html = wrap(bodyCell(`
    ${h1(`Welcome to Companion by Danè, ${firstName} ✦`)}
    ${p(`We're so glad you're here. Your portal is ready and waiting — a space built for reflection, confidence and growth.`)}
    ${p(`Here's what you can do right now:`)}
    <ul style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#6E667A;margin:0 0 20px 0;padding-left:20px;line-height:1.8;">
      <li>Start a conversation with your AI companion</li>
      <li>Complete your profile and set your first intention</li>
      <li>Book your welcome check-in with Danè</li>
      <li>Explore your first reflection prompt</li>
    </ul>
    ${p(`This is a coaching space, not a therapy service. The companion is here to support your thinking — always available, always in your corner.`)}
    ${button('Open my portal', `${BASE_URL}/portal`)}
    ${divider()}
    ${p(`Questions? Reply to this email or visit <a href="${BASE_URL}/faq" style="color:#4B2E83;">our FAQ</a>.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Companion by Danè ✦',
    html,
  })
}

// ---------------------------------------------------------------------------
// B) Booking confirmation
// ---------------------------------------------------------------------------

export async function sendBookingConfirmation(
  to: string,
  firstName: string,
  sessionType: string,
  date: string,
  time: string,
  meetingUrl: string,
) {
  const gcalDate = date.replace(/-/g, '')
  const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Coaching session with Danè`)}&dates=${gcalDate}/${gcalDate}&details=${encodeURIComponent(`Join: ${meetingUrl}`)}`

  const html = wrap(bodyCell(`
    ${h1('Your session is confirmed ✓')}
    ${p(`Hi ${firstName}, your coaching session with Danè is booked. Here are your details:`)}
    ${infoCard([
      ['Session', sessionType],
      ['Date', date],
      ['Time', time],
      ['Format', 'Online video call'],
    ])}
    <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#2E1A47;margin:20px 0 8px 0;text-transform:uppercase;letter-spacing:0.05em;">Join your session</p>
    ${button('Join meeting', meetingUrl)}
    <div style="margin-top:12px;">
      <a href="${gcalLink}" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#7E64B5;text-decoration:underline;">+ Add to Google Calendar</a>
    </div>
    ${divider()}
    ${p(`To reschedule or cancel, visit your <a href="${BASE_URL}/portal/bookings" style="color:#4B2E83;">bookings page</a>. We recommend arriving a minute early so you can settle in.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your session with Danè is confirmed ✓',
    html,
  })
}

// ---------------------------------------------------------------------------
// C) Booking reminder — 24h before
// ---------------------------------------------------------------------------

export async function sendBookingReminder24h(
  to: string,
  firstName: string,
  sessionType: string,
  time: string,
  meetingUrl: string,
) {
  const html = wrap(bodyCell(`
    ${h1('Your coaching session is tomorrow 🌟')}
    ${p(`Hi ${firstName}, just a reminder that you have a session with Danè tomorrow.`)}
    ${infoCard([
      ['Session', sessionType],
      ['Time', time],
    ])}
    ${p(`Take a few minutes before the session to reflect: <em style="color:#4B2E83;">what do you most want to explore or shift in this conversation?</em> Writing it down helps.`)}
    ${button('Join meeting', meetingUrl)}
    ${divider()}
    ${p(`You can also add a pre-session note in your <a href="${BASE_URL}/portal/bookings" style="color:#4B2E83;">bookings page</a> to share your intention with Danè before you start.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your coaching session is tomorrow 🌟',
    html,
  })
}

// ---------------------------------------------------------------------------
// D) Homework assigned
// ---------------------------------------------------------------------------

export async function sendHomeworkAssigned(
  to: string,
  firstName: string,
  homeworkTitle: string,
  dueDate: string,
  instructions: string,
) {
  const html = wrap(bodyCell(`
    ${h1('New homework from Danè 📚')}
    ${p(`Hi ${firstName}, Danè has assigned you a new homework task.`)}
    ${infoCard([
      ['Title', homeworkTitle],
      ['Due', dueDate],
    ])}
    <div style="background:#F6F3FB;border-left:4px solid #4B2E83;border-radius:0 12px 12px 0;padding:14px 18px;margin:16px 0;">
      <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#2E1A47;margin:0 0 6px 0;">Instructions</p>
      <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#6E667A;margin:0;line-height:1.65;">${instructions}</p>
    </div>
    ${p(`Complete your homework by submitting a journal entry in your portal.`)}
    ${button('View homework', `${BASE_URL}/portal/homework`)}
    ${divider()}
    ${p(`Homework helps you carry the coaching work into your everyday. Take your time with it — there's no perfect answer.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: `New homework from Danè 📚`,
    html,
  })
}

// ---------------------------------------------------------------------------
// E) Invoice paid
// ---------------------------------------------------------------------------

export async function sendInvoicePaid(
  to: string,
  firstName: string,
  invoiceNumber: string,
  amount: string,
  planName: string,
) {
  const html = wrap(bodyCell(`
    ${h1('Payment confirmed ✓')}
    ${p(`Hi ${firstName}, your payment has been received. Thank you for being part of Companion by Danè.`)}
    ${infoCard([
      ['Invoice', invoiceNumber],
      ['Amount', amount],
      ['Plan', planName],
      ['Status', '<span style="color:#22c55e;font-weight:700;">Paid</span>'],
    ])}
    ${p(`Your subscription is active and all features are available in your portal.`)}
    ${button('Open my portal', `${BASE_URL}/portal`)}
    <div style="margin-top:12px;">
      <a href="${BASE_URL}/portal/billing" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#7E64B5;text-decoration:underline;">View billing history →</a>
    </div>
    ${divider()}
    ${p(`If you have questions about your invoice, contact <a href="mailto:dane@companionai.coach" style="color:#4B2E83;">dane@companionai.coach</a>.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Payment confirmed — ${invoiceNumber}`,
    html,
  })
}

// ---------------------------------------------------------------------------
// F) Password reset
// ---------------------------------------------------------------------------

export async function sendPasswordReset(to: string, resetLink: string) {
  const html = wrap(bodyCell(`
    ${h1('Reset your password')}
    ${p(`We received a request to reset the password for your Companion by Danè account.`)}
    ${p(`Click the button below to set a new password. This link expires in <strong style="color:#2E1A47;">1 hour</strong>.`)}
    ${button('Reset my password', resetLink, '#2E1A47')}
    ${divider()}
    ${p(`If you didn't request a password reset, you can safely ignore this email — your account has not been changed.`, 'font-size:13px;color:#9B93A8;')}
    ${p(`For security, never share this link with anyone.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your Companion password',
    html,
  })
}

// ---------------------------------------------------------------------------
// G) Token / usage warning
// ---------------------------------------------------------------------------

export async function sendTokenWarning(
  to: string,
  firstName: string,
  usedPct: number,
) {
  const barFill = Math.min(usedPct, 100)
  const barColor = barFill >= 90 ? '#ef4444' : '#f59e0b'

  const html = wrap(bodyCell(`
    ${h1(`You've used ${usedPct}% of your monthly conversations`)}
    ${p(`Hi ${firstName}, you're approaching your monthly conversation limit.`)}
    <div style="margin:20px 0;">
      <div style="display:flex;justify-content:space-between;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#9B93A8;margin-bottom:6px;">
        <span>Conversations used</span>
        <span style="font-weight:600;color:#2E1A47;">${usedPct}%</span>
      </div>
      <div style="background:#E8E1F7;border-radius:99px;height:10px;overflow:hidden;">
        <div style="background:${barColor};height:10px;width:${barFill}%;border-radius:99px;"></div>
      </div>
    </div>
    ${p(`When you reach 100%, your conversations will pause until the next billing cycle — unless you upgrade your plan.`)}
    ${button('Upgrade my plan', `${BASE_URL}/portal/billing`, barColor)}
    <div style="margin-top:12px;">
      <a href="${BASE_URL}/portal/analytics" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#7E64B5;text-decoration:underline;">View my usage →</a>
    </div>
    ${divider()}
    ${p(`Upgrading keeps your conversations flowing without interruption. Compare plans on your <a href="${BASE_URL}/portal/billing" style="color:#4B2E83;">billing page</a>.`, 'font-size:13px;color:#9B93A8;')}
  `))

  return resend.emails.send({
    from: FROM,
    to,
    subject: `You've used ${usedPct}% of your monthly conversations`,
    html,
  })
}
