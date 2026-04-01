import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@ziz/db'
import { decryptCredential } from '@ziz/shared/src/encryption'
import axios from 'axios'

type Params = { params: { id: string } }

export async function DELETE(_: NextRequest, { params }: Params) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const cred = await prisma.credential.findFirst({ where: { id: params.id, userId } })
  if (!cred) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.credential.delete({ where: { id: params.id } })
  return NextResponse.json({ data: { deleted: true } })
}

export async function POST(req: NextRequest, { params }: Params) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const cred = await prisma.credential.findFirst({ where: { id: params.id, userId } })
  if (!cred) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data = decryptCredential(cred.encryptedData, cred.iv)
  let testError: string | null = null
  let verified = false

  try {
    switch (cred.service) {
      case 'slack': {
        const res = await axios.get('https://slack.com/api/auth.test', {
          headers: { Authorization: `Bearer ${data.botToken}` }, timeout: 8000,
        })
        if (!res.data.ok) throw new Error(res.data.error)
        verified = true
        break
      }
      case 'hubspot': {
        await axios.get('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: { Authorization: `Bearer ${data.accessToken}` }, timeout: 8000,
        })
        verified = true
        break
      }
      case 'notion': {
        await axios.get('https://api.notion.com/v1/users/me', {
          headers: { Authorization: `Bearer ${data.apiKey}`, 'Notion-Version': '2022-06-28' }, timeout: 8000,
        })
        verified = true
        break
      }
      case 'airtable': {
        await axios.get('https://api.airtable.com/v0/meta/whoami', {
          headers: { Authorization: `Bearer ${data.apiKey}` }, timeout: 8000,
        })
        verified = true
        break
      }
      case 'stripe': {
        await axios.get('https://api.stripe.com/v1/account', {
          headers: { Authorization: `Bearer ${data.secretKey}` }, timeout: 8000,
        })
        verified = true
        break
      }
      case 'telegram': {
        const res = await axios.get(`https://api.telegram.org/bot${data.botToken}/getMe`, { timeout: 8000 })
        if (!res.data.ok) throw new Error('Invalid bot token')
        verified = true
        break
      }
      default:
        verified = true // For services without a test endpoint, assume valid
    }
  } catch (e: any) {
    testError = e.response?.data?.error || e.message || 'Connection failed'
    verified  = false
  }

  await prisma.credential.update({
    where: { id: params.id },
    data: {
      isVerified:    verified,
      lastTestedAt:  new Date(),
      lastTestError: testError,
    },
  })

  return NextResponse.json({
    data: {
      verified,
      error: testError,
      message: verified ? 'Connection successful!' : `Connection failed: ${testError}`,
    },
  })
}
