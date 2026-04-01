import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@ziz/db'
import { createHash } from 'crypto'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: string
      name?: string
      email?: string
      image?: string
      occupation?: string
      company?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
    occupation?: string
    company?: string
  }
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password + process.env.NEXTAUTH_SECRET).digest('hex')
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            plan: true,
            emailVerified: true,
            occupation: true,
            company: true
          },
        })
        if (!user || !user.hashedPassword || !user.emailVerified) return null
        const hash = hashPassword(credentials.password)
        if (hash !== user.hashedPassword) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          occupation: user.occupation,
          company: user.company
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.plan = (user as any).plan
        token.occupation = (user as any).occupation
        token.company = (user as any).company
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).id = (token as any).id
        ;(session.user as any).plan = (token as any).plan
        ;(session.user as any).occupation = (token as any).occupation
        ;(session.user as any).company = (token as any).company
      }
      return session
    },
  },
}
