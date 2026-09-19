// Redeployed after the owner's private email delivery settings were confirmed.
const requests = new Map()
const clean = (value, max = 500) => String(value ?? '').replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max)
const escapeHtml = (value) => clean(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]))

const eventDetails = (body) => {
  if (body.type === 'visitor_book') {
    return {
      subject: `New Visitors’ Book entry from ${clean(body.name, 80) || 'a visitor'}`,
      heading: 'New Visitors’ Book entry',
      rows: [
        ['Name', body.name],
        ['Family branch', body.familyBranch],
        ['Location', body.location],
        ['Family connection', body.familyConnection],
        ['Message', body.message]
      ],
      link: 'https://metcalfe-kavanagh-family-site.vercel.app/?view=admin'
    }
  }
  if (body.type === 'archive_upload') {
    const kind = body.mediaType === 'document' ? 'document' : 'photograph'
    return {
      subject: `New family archive ${kind} uploaded`,
      heading: `New ${kind} uploaded to the family archive`,
      rows: [
        ['Title', body.title],
        ['Category', body.category],
        ['Original file', body.fileName],
        ['People tagged', body.peopleCount],
        ['Unidentified people', body.unidentified ? 'Yes' : 'No']
      ],
      link: 'https://metcalfe-kavanagh-family-site.vercel.app/?view=admin'
    }
  }
  return null
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const origin = clean(req.headers.origin, 200)
  if (origin && !/^https:\/\/([a-z0-9-]+\.)?metcalfe-kavanagh-family-site\.vercel\.app$/i.test(origin)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const ip = clean(req.headers['x-forwarded-for'] || 'visitor', 100).split(',')[0]
  const now = Date.now()
  const recent = (requests.get(ip) || []).filter(time => now - time < 3600000)
  if (recent.length >= 20) return res.status(429).json({ error: 'Notification limit reached' })
  recent.push(now)
  requests.set(ip, recent)

  const details = eventDetails(req.body || {})
  if (!details) return res.status(400).json({ error: 'Unknown notification type' })

  const apiKey = clean(process.env.RESEND_API_KEY, 200)
  const recipient = clean(process.env.NOTIFICATION_EMAIL, 254)
  if (!apiKey || !recipient) {
    console.error('submission-notification: email configuration missing')
    return res.status(503).json({ error: 'Notification service unavailable' })
  }

  const rows = details.rows
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([label, value]) => `<tr><th style="text-align:left;padding:8px 12px 8px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px 0">${escapeHtml(value)}</td></tr>`)
    .join('')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
      'idempotency-key': `family-site-${clean(req.body?.id, 100) || crypto.randomUUID()}`
    },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM || 'Metcalfe & Kavanagh Family Site <onboarding@resend.dev>',
      to: [recipient],
      subject: details.subject,
      html: `<div style="font-family:Arial,sans-serif;color:#183d35;max-width:620px"><h1 style="font-family:Georgia,serif">${escapeHtml(details.heading)}</h1><table style="border-collapse:collapse;width:100%">${rows}</table><p style="margin-top:24px"><a href="${details.link}" style="background:#174a3e;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Open site administration</a></p><p style="color:#6f7772;font-size:13px">This private notification was sent only to the site owner.</p></div>`
    })
  })

  if (!response.ok) {
    console.error('submission-notification: provider error', response.status, await response.text())
    return res.status(502).json({ error: 'Notification could not be sent' })
  }
  return res.status(204).end()
}
