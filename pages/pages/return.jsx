import React from 'react'
import Head from 'next/head'
  import { UserContext } from '../../pages/_app'

// ...existing code...
export default function Return({ status, customerEmail, items, paymentIntentStatus, paymentError }) {
  const isComplete = status === 'complete'
  const isFailed = !isComplete && (status === 'expired' || ['requires_payment_method', 'canceled'].includes(paymentIntentStatus))
  const { user, setUser } = React.useContext(UserContext)
  return (
    <>
      <Head>
        <title>
          {isComplete
            ? 'Payment Successful'
            : isFailed
            ? 'Payment Failed'
            : 'Processing Payment'} | Aurora
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <section
        id="checkout-result"
        className={`checkout-result ${isComplete ? 'success' : isFailed ? 'failed' : 'processing'}`}
        aria-live="polite"
      >
        {isComplete ? (
          <div className="card">
            <div className="icon success-icon" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
            <h1>Thank you!</h1>
            <p className="lead">
              We appreciate your business. A confirmation email will be sent to{' '}
              <strong>{user.email || 'your email'}</strong>. For questions email{' '}
              <a href="mailto:orders@aurora.com">orders@aurora.com</a>.
            </p>
            {items && items.length > 0 && (
              <div className="summary">
                <h2>Order summary</h2>
                <ul>
                  {items.map(item => (
                    <li key={item.id}>
                      <span className="item-name">{item.description}</span>
                      <span className="item-qty">× {item.quantity}</span>
                      {item.amount_total ? (
                        <span className="item-amt">
                          ${(item.amount_total / 100).toFixed(2)}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="actions">
              <a href="/" className="btn btn-primary">Continue Shopping</a>
            </div>
          </div>
        ) : isFailed ? (
          <div className="card">
            <div className="icon error-icon" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h1>Payment Failed</h1>
            <p className="lead">
              Your payment could not be completed.
              {paymentIntentStatus && (
                <> (Status: <strong>{paymentIntentStatus}</strong>)</>
              )}
            </p>
            {paymentError && <p className="error-detail">{paymentError}</p>}
            <p className="lead">
              Please retry or contact <a href="mailto:orders@aurora.com">support</a>.
            </p>
            <div className="actions">
              <a href="/" className="btn btn-link">Return Home</a>
              <a href="/pages/checkout" className="btn btn-primary">Retry Payment</a>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="icon spinner" aria-hidden="true">
              <div className="dot dot1" />
              <div className="dot dot2" />
              <div className="dot dot3" />
            </div>
            <h1>Processing your payment…</h1>
            <p className="lead">Please wait while we confirm the transaction.</p>
            <div className="actions">
              <a href="/" className="btn btn-link">Return Home</a>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        #checkout-result {
          display: flex;
          justify-content: center;
          padding: 60px 20px 100px;
        }
        .card {
          max-width: 640px;
          width: 100%;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          padding: 40px 42px 48px;
          text-align: center;
        }
        h1 {
          font-size: 28px;
          margin: 16px 0 12px;
          font-weight: 600;
          letter-spacing: .4px;
        }
        h2 {
          font-size: 16px;
          margin: 32px 0 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .lead {
          font-size: 15px;
          line-height: 1.5;
          color: #444;
          margin: 0 0 8px;
        }
        .error-detail {
          font-size: 13px;
            color: #b42318;
            background: #fdeceb;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 4px 0 8px;
            line-height: 1.4;
        }
        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          margin: 0 auto;
        }
        .success-icon {
          color: #1a9e42;
          background: #e6f8ec;
        }
        .error-icon {
          color: #b42318;
          background: #fdeceb;
        }
        .spinner {
          position: relative;
          background: #eef2f7;
          animation: pulse 1.8s infinite ease-in-out;
        }
        .spinner .dot {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #4a7efc;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .dot1 { top: 22px; left: 22px; animation-delay: 0s; }
        .dot2 { top: 22px; right: 22px; animation-delay: .3s; }
        .dot3 { bottom: 22px; left: 50%; transform: translateX(-50%); animation-delay: .6s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.5); opacity: .5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .summary ul {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
          border: 1px solid #e5e8ec;
          border-radius: 12px;
          overflow: hidden;
        }
        .summary li {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          font-size: 14px;
          background: #fafbfc;
        }
        .summary li:not(:last-child) {
          border-bottom: 1px solid #e5e8ec;
        }
        .item-name { flex: 1; font-weight: 500; }
        .item-qty { margin-left: 12px; color: #666; }
        .item-amt { margin-left: auto; font-weight: 600; }
        .actions {
          margin-top: 32px;
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-block;
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background .2s, color .2s;
        }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-link { background: transparent; color: #2563eb; }
        .btn-link:hover { text-decoration: underline; }
        @media (max-width: 640px) {
          .card { padding: 32px 24px 40px; }
          h1 { font-size: 24px; }
        }
      `}</style>
    </>
  )
}

// Move Stripe import here so it only loads on the server
export async function getServerSideProps(ctx) {
  const { session_id } = ctx.query
  if (!session_id) return { notFound: true }

  const { stripe } = await import('../../lib/stripe') // server-only

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent']
    })

    if (session.status === 'open') {
      return { redirect: { destination: '/', permanent: false } }
    }

    const items = (session.line_items?.data || []).map(li => ({
      id: li.id,
      quantity: li.quantity,
      description: li.description || 'Item',
      amount_total: li.amount_total
    }))

    let paymentIntentStatus = ''
    let paymentError = ''
    if (session.payment_intent && typeof session.payment_intent === 'object') {
      paymentIntentStatus = session.payment_intent.status
      paymentError = session.payment_intent.last_payment_error?.message || ''
    }

    return {
      props: {
        status: session.status,
        customerEmail: session.customer_details?.email || '',
        items,
        paymentIntentStatus,
        paymentError
      }
    }
  } catch (e) {
    console.error('Stripe session retrieve error:', e.message)
    return { redirect: { destination: '/', permanent: false } }
  }
}