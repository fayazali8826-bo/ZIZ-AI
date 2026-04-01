import { createCipheriv, createDecipheriv, scryptSync, randomBytes } from 'crypto'

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw) throw new Error('ENCRYPTION_KEY environment variable is not set')
  return scryptSync(raw, 'ziz-credential-salt-v1', 32)
}

export function encryptCredential(data: Record<string, string>): { encryptedData: string; iv: string } {
  const key = getKey()
  const iv  = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const json = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const combined = Buffer.concat([encrypted, tag])
  return {
    encryptedData: combined.toString('base64'),
    iv:            iv.toString('base64'),
  }
}

export function decryptCredential(encryptedData: string, iv: string): Record<string, string> {
  const key      = getKey()
  const ivBuffer = Buffer.from(iv, 'base64')
  const combined = Buffer.from(encryptedData, 'base64')
  const TAG_LEN  = 16
  const encrypted = combined.slice(0, combined.length - TAG_LEN)
  const tag       = combined.slice(combined.length - TAG_LEN)
  const decipher  = createDecipheriv('aes-256-gcm', key, ivBuffer)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return JSON.parse(decrypted.toString('utf8'))
}
