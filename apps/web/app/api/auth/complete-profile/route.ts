import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@ziz/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const Schema = z.object({
  name:       z.string().min(1, 'Name is required'),
  occupation: z.string().optional(),
  company:    z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: z.infer<typeof Schema>
  try {
    body = Schema.parse(await req.json())
  } catch (e: any) {
    return NextResponse.json({ error: e.errors?.[0]?.message || 'Invalid input' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      occupation: body.occupation || null,
      company: body.company || null,
    },
    select: { id: true, email: true, name: true, occupation: true, company: true },
  })

  return NextResponse.json({ user })
}