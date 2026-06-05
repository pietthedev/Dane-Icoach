#!/usr/bin/env node
/**
 * Creates Paystack recurring plans for CompanionAI.
 * Run once: node scripts/setup-paystack-plans.js
 *
 * Requires PAYSTACK_SECRET_KEY in the environment:
 *   PAYSTACK_SECRET_KEY=sk_live_xxx node scripts/setup-paystack-plans.js
 *
 * Outputs the plan codes — add them to .env.local and Vercel env vars.
 */

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

if (!SECRET_KEY) {
  console.error('❌  PAYSTACK_SECRET_KEY is not set.')
  console.error('    Run: PAYSTACK_SECRET_KEY=sk_live_xxx node scripts/setup-paystack-plans.js')
  process.exit(1)
}

async function createPlan(payload) {
  const res = await fetch('https://api.paystack.co/plan', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

async function listPlans() {
  const res = await fetch('https://api.paystack.co/plan?perPage=50', {
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
  })
  return res.json()
}

async function main() {
  console.log('🔍  Checking existing Paystack plans...\n')

  const existing = await listPlans()
  const plans    = existing?.data ?? []

  let growCode     = plans.find(p => p.name === 'CompanionAI Grow')?.plan_code     ?? null
  let businessCode = plans.find(p => p.name === 'CompanionAI Business')?.plan_code ?? null

  if (growCode) {
    console.log(`✓  Grow plan already exists: ${growCode}`)
  } else {
    console.log('📝  Creating Grow plan (R349/month)...')
    const result = await createPlan({
      name:     'CompanionAI Grow',
      amount:   34900,           // in kobo — R349.00
      interval: 'monthly',
      currency: 'ZAR',
    })
    if (!result.status) {
      console.error('❌  Failed to create Grow plan:', result)
      process.exit(1)
    }
    growCode = result.data.plan_code
    console.log(`✓  Grow plan created: ${growCode}`)
  }

  if (businessCode) {
    console.log(`✓  Business plan already exists: ${businessCode}`)
  } else {
    console.log('📝  Creating Business plan (R699/month)...')
    const result = await createPlan({
      name:     'CompanionAI Business',
      amount:   69900,           // in kobo — R699.00
      interval: 'monthly',
      currency: 'ZAR',
    })
    if (!result.status) {
      console.error('❌  Failed to create Business plan:', result)
      process.exit(1)
    }
    businessCode = result.data.plan_code
    console.log(`✓  Business plan created: ${businessCode}`)
  }

  console.log('\n✅  Done! Add these to .env.local AND Vercel environment variables:\n')
  console.log(`PAYSTACK_GROW_PLAN_CODE=${growCode}`)
  console.log(`PAYSTACK_BUSINESS_PLAN_CODE=${businessCode}`)
  console.log('\n⚠️   Also enable these webhook events in your Paystack dashboard:')
  console.log('    charge.success, subscription.create, subscription.disable, invoice.payment_failed')
}

main().catch(err => {
  console.error('❌  Unexpected error:', err)
  process.exit(1)
})
