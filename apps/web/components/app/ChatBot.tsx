'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'

// ── ZIZ LOGO MARK ────────────────────────────────────────────────────
function ZizMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none">
      <path d="M3 14 C3 9.5 5.5 6 9.5 6 C13.5 6 15.5 10 18 14 C20.5 18 22.5 22 26.5 22 C30.5 22 33 18.5 33 14 C33 9.5 30.5 6 26.5 6 C22.5 6 20.5 10 18 14 C15.5 18 13.5 22 9.5 22 C5.5 22 3 18.5 3 14 Z"
        stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="3" fill="#00e5a0"/>
    </svg>
  )
}

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const ZIZ_KNOWLEDGE = `
You are a helpful chatbot for Ziz - an AI-powered automation platform. Here's what you know about Ziz:

ABOUT ZIZ:
- Ziz is an automation platform that lets users automate their business in plain English
- No coding required - just describe what you want in English and Ziz AI builds it
- Uses AI agents to understand business goals and create workflows automatically

KEY FEATURES:
1. AI builds workflows for you - describe your automation in plain English
2. Runs instantly 24/7 - workflows execute automatically when triggered
3. 35+ app integrations including Slack, Gmail, HubSpot, Stripe, Notion, Airtable, WhatsApp, Shopify, Jira
4. AI agent inside workflows - can browse web, read emails, query data, make decisions
5. Enterprise-grade reliability - automatic retries, error notifications, audit logs
6. Fast setup - from idea to live automation in 2 minutes

HOW IT WORKS:
1. Describe your automation in plain English
2. Ziz AI builds the complete workflow
3. Connect your app accounts
4. Activate and let Ziz run it 24/7

PRICING:
- Free Plan: 100 runs/month, up to 3 workflows, 5 connectors, email support ($0)
- Pro Plan: 10,000 runs/month, unlimited workflows, all connectors, webhook triggers ($29/month)
- Business Plan: Unlimited runs, unlimited workflows, API access, 5 team seats, Slack support ($99/month)

EXAMPLES OF AUTOMATIONS:
- When someone pays on Stripe → send Slack message + add to Google Sheet
- New form submissions → send email + add to CRM
- Email arrives → AI reads it + drafts reply + logs to database

KEY BENEFITS:
- No developers needed
- No JSON or code to write
- No documentation to read
- Works 24/7 automatically
- Enterprise-grade security and uptime

When answering questions, be friendly, helpful, and focus on how Ziz can solve their automation problems.
Answer in a conversational tone and keep responses concise.
`

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hey! 👋 I\'m the Ziz assistant. I can help you learn about automating your business. What would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Feature questions
    if (
      lowerMessage.includes('feature') ||
      lowerMessage.includes('what can') ||
      lowerMessage.includes('capabilities')
    ) {
      return '✨ Ziz has some amazing features:\n\n• **AI Workflow Builder** - Describe what you want in plain English\n• **35+ App Integrations** - Connect all your favorite tools\n• **AI Agents** - Add autonomous decision-making steps\n• **24/7 Automation** - Runs automatically whenever triggered\n• **Enterprise Security** - AES-256 encryption and SOC 2 compliant\n\nWhat specific feature interests you?'
    }

    if (
      lowerMessage.includes('pricing') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('price') ||
      lowerMessage.includes('plan')
    ) {
      return '💰 Ziz has three pricing plans:\n\n**Free** - $0/month\n• 100 automation runs\n• 3 active workflows\n• Email support\n\n**Pro** - $29/month\n• 10,000 runs\n• Unlimited workflows\n• All 35+ connectors\n• Priority support\n\n**Business** - $99/month\n• Unlimited runs\n• API access\n• 5 team seats\n• Slack support\n\nAll plans include a 14-day free trial! 🎉'
    }

    if (
      lowerMessage.includes('how') ||
      lowerMessage.includes('work') ||
      lowerMessage.includes('process')
    ) {
      return '🚀 Getting started with Ziz is super simple:\n\n1️⃣ **Describe** - Tell Ziz what you want to automate\n2️⃣ **Build** - AI creates your complete workflow\n3️⃣ **Connect** - Link your app accounts\n4️⃣ **Activate** - Turn it on and let Ziz work\n\nThe whole process takes about 2-5 minutes! No code, no complexity.'
    }

    if (lowerMessage.includes('integration') || lowerMessage.includes('app')) {
      return '🔗 Ziz connects with 35+ apps including:\n\n**Messaging:** Slack, Gmail, WhatsApp\n**CRM:** HubSpot, Salesforce\n**Payments:** Stripe, PayPal\n**Data:** Google Sheets, Airtable, Notion\n**Project Mgmt:** Jira, Asana\n**And many more!**\n\nDon\'t see your app? We can add custom connectors on request!'
    }

    if (
      lowerMessage.includes('security') ||
      lowerMessage.includes('safe') ||
      lowerMessage.includes('encrypt')
    ) {
      return '🛡️ Security is built into Ziz:\n\n• **AES-256 Encryption** - Your credentials are encrypted\n• **SOC 2 Compliant** - Enterprise-grade standards\n• **99.9% Uptime SLA** - Reliable 24/7\n• **Zero Code Storage** - Your automation data stays secure\n• **Audit Logs** - See everything that happened\n\nYour data is safe with us!'
    }

    if (
      lowerMessage.includes('example') ||
      lowerMessage.includes('use case') ||
      lowerMessage.includes('automate')
    ) {
      return '💡 Here are popular automations people build:\n\n**E-commerce:**\n• New Stripe payment → Send welcome email + add to CRM\n\n**Support:**\n• Email received → AI reads it + drafts reply\n\n**Projects:**\n• Form submission → Create task in Jira + notify team\n\n**Content:**\n• New blog post → Share to social + add to newsletter\n\nWhat would you like to automate?'
    }

    if (lowerMessage.includes('free') || lowerMessage.includes('trial')) {
      return '🎉 Great news! Ziz is completely free to start:\n\n• **Free Plan** - 100 runs/month, no credit card needed\n• **Pro/Business** - 14-day free trial to test everything\n\nJust head to our Sign Up page and you\'ll be building automations in minutes!'
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('agent')) {
      return '🤖 Ziz uses AI in two ways:\n\n1. **AI Workflow Builder** - Understands your natural language description and builds the workflow automatically\n\n2. **AI Agent Steps** - Add a smart agent inside your workflow that can:\n   • Browse the web\n   • Read and summarize emails\n   • Query your databases\n   • Make intelligent decisions\n   • Take actions autonomously\n\nIt\'s like having an extra team member working 24/7!'
    }

    // Default response
    return "That's a great question! 😊 Here are some things I can help you with:\n\n• **Features** - What can Ziz do?\n• **Pricing** - How much does it cost?\n• **How it works** - The process from start to finish\n• **Integrations** - What apps does Ziz connect with?\n• **Examples** - What can I automate?\n• **Security** - Is it safe?\n\nFeel free to ask me anything about Ziz!"
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(input),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-white rounded-2xl shadow-xl shadow-black/20 border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ZizMark size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Ziz Assistant</h3>
                <p className="text-xs text-brand-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                    message.type === 'user'
                      ? 'bg-brand-500 text-white rounded-br-none'
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {message.content.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
