import Link from 'next/link'
import { Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react'

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          ZIZ
        </Link>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          ← Back to home
        </Link>
      </div>
    </header>
  )
}

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Encryption at Rest',
      description: 'All API credentials are encrypted using AES-256 encryption. Your secrets are safe.',
    },
    {
      icon: Shield,
      title: 'TLS/SSL in Transit',
      description: 'All data transmitted between your browser and our servers is encrypted with TLS 1.3.',
    },
    {
      icon: CheckCircle,
      title: 'SOC 2 Type II',
      description: 'We undergo annual SOC 2 Type II audits to ensure enterprise-grade security controls.',
    },
    {
      icon: AlertCircle,
      title: '24/7 Monitoring',
      description: 'Our security team monitors the platform 24/7 for threats and anomalies.',
    },
  ]

  const complianceItems = [
    'SOC 2 Type II Certified',
    'GDPR Compliant',
    'CCPA Compliant',
    '99.9% Uptime SLA',
    'ISO 27001 Ready',
    'regular penetration testing',
  ]

  return (
    <>
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <section className="py-20 px-6 bg-gradient-to-br from-brand-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              Enterprise-Grade Security
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your automations are secure with Ziz
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              We take security seriously. Learn how we protect your data and keep your automations safe.
            </p>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">How we keep you safe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="card p-8">
                    <Icon className="w-8 h-8 text-brand-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Compliance & Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Certifications</h3>
                <div className="space-y-4">
                  {complianceItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-8 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Practices</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>Regular security audits and penetration testing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>Vulnerability disclosure program</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>Multi-factor authentication support</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>Role-based access control (RBAC)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>Automatic data backups every hour</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>Disaster recovery procedures</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Security FAQ</h2>
            <div className="space-y-6">
              <div className="card p-8">
                <h3 className="font-semibold text-gray-900 mb-2">How are my API credentials stored?</h3>
                <p className="text-gray-600">
                  Your API credentials are encrypted immediately upon input using AES-256 encryption. We never store credentials in plain text. Even our engineers cannot access your credentials.
                </p>
              </div>

              <div className="card p-8">
                <h3 className="font-semibold text-gray-900 mb-2">Where is my data stored?</h3>
                <p className="text-gray-600">
                  Your workflow definitions and execution logs are stored on secure, encrypted databases in US data centers. We maintain backups in geographically redundant locations for disaster recovery.
                </p>
              </div>

              <div className="card p-8">
                <h3 className="font-semibold text-gray-900 mb-2">Can you access my automations?</h3>
                <p className="text-gray-600">
                  No. Your workflow definitions and execution logs are isolated per account and encrypted. Our team cannot access your automations without explicit permission for support purposes.
                </p>
              </div>

              <div className="card p-8">
                <h3 className="font-semibold text-gray-900 mb-2">What's your uptime guarantee?</h3>
                <p className="text-gray-600">
                  We maintain a 99.9% uptime SLA. This means your automations run reliably 24/7. We have redundant systems and automatic failover to ensure continuous operation.
                </p>
              </div>

              <div className="card p-8">
                <h3 className="font-semibold text-gray-900 mb-2">How do you handle security incidents?</h3>
                <p className="text-gray-600">
                  We have a dedicated security team that monitors for threats 24/7. In case of any incident, we have a documented incident response procedure. Affected users are notified immediately.
                </p>
              </div>

              <div className="card p-8">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer SSO and SAML?</h3>
                <p className="text-gray-600">
                  Yes! Business plan customers can enable SSO/SAML authentication for their team. This provides additional security and easier access management for enterprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-24 px-6 bg-gradient-to-br from-brand-500 to-brand-600">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Security is our top priority
            </h2>
            <p className="text-brand-100 text-lg mb-8">
              Have security questions or want to report a vulnerability? Contact our security team.
            </p>
            <a href="mailto:security@ziz.app" className="inline-block bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
              Contact Security Team
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          <p>© 2026 Ziz. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
