// Plan queries
export const ALL_PLANS_QUERY = `
*[_type == "plan" && isActive == true] | order(order asc) {
  _id,
  key,
  name,
  "slug": slug.current,
  description,
  price,
  features,
  limits,
  isPopular,
  order,
  stripeProductId,
  stripePriceId,
  trialDays,
  flexibleTrial
}
`;

export const PLAN_BY_SLUG_QUERY = `
*[_type == "plan" && slug.current == $slug && isActive == true][0] {
  _id,
  key,
  name,
  "slug": slug.current,
  description,
  price,
  features,
  limits,
  isPopular,
  stripeProductId,
  stripePriceId,
  trialDays,
  flexibleTrial
}
`;

export const PLAN_BY_ID_QUERY = `
*[_type == "plan" && _id == $planId][0] {
  _id,
  key,
  name,
  "slug": slug.current,
  description,
  price,
  features,
  limits,
  isPopular,
  stripeProductId,
  stripePriceId,
  trialDays,
  flexibleTrial
}
`;

export const PLAN_BY_STRIPE_PRICE_ID_QUERY = `
*[_type == "plan" && stripePriceId == $priceId][0] {
  _id,
  key,
  name,
  "slug": slug.current,
  description,
  price,
  features,
  limits,
  stripeProductId,
  stripePriceId,
  trialDays,
  flexibleTrial
}
`;

export const PRICING_PLANS_QUERY = `
*[_type == "plan" && isActive == true] | order(order asc) {
  _id,
  key,
  name,
  "slug": slug.current,
  description,
  price,
  features,
  limits,
  isPopular,
  order,
  trialDays,
  flexibleTrial
}
`;

// Subscription queries
export const SUBSCRIPTION_BY_TENANT_QUERY = `
*[_type == "subscription" && tenantType == $tenantType && tenantId == $tenantId && (status == "active" || status == "trialing")] | order(_createdAt desc)[0] {
  _id,
  plan->{
    _id,
    key,
    name,
    "slug": slug.current,
    price,
    features,
    limits,
    flexibleTrial
  },
  status,
  startDate,
  endDate,
  trialEndDate,
  trialStatus,
  cancelAtPeriodEnd,
  usage,
  stripeSubscriptionId,
  stripeCustomerId
}
`;

export const ALL_SUBSCRIPTIONS_BY_TENANT_QUERY = `
*[_type == "subscription" && tenantType == $tenantType && tenantId == $tenantId] | order(_createdAt desc) {
  _id,
  plan->{
    _id,
    key,
    name,
    "slug": slug.current,
    price,
    flexibleTrial
  },
  status,
  startDate,
  endDate,
  trialEndDate,
  trialStatus,
  usage,
  _createdAt
}
`;

export const SUBSCRIPTION_BY_ID_QUERY = `
*[_type == "subscription" && _id == $subscriptionId][0] {
  _id,
  tenantType,
  tenantId,
  tenantName,
  tenant->{
    _id,
    name,
    tenantId
  },
  plan->{
    _id,
    key,
    name,
    "slug": slug.current,
    price,
    features,
    limits,
    flexibleTrial
  },
  status,
  startDate,
  endDate,
  trialEndDate,
  trialStatus,
  cancelAtPeriodEnd,
  usage,
  stripeSubscriptionId,
  stripeCustomerId
}
`;

export const SUBSCRIPTION_BY_STRIPE_SUBSCRIPTION_ID_QUERY = `
*[_type == "subscription" && stripeSubscriptionId == $stripeSubscriptionId][0] {
  _id,
  tenantType,
  tenantId,
  tenantName,
  status,
  startDate,
  endDate,
  trialEndDate,
  trialStatus,
  cancelAtPeriodEnd,
  stripeSubscriptionId,
  stripeCustomerId,
  plan->{ _id, flexibleTrial },
  usage
}
`;

export const SUBSCRIPTION_USAGE_QUERY = `
*[_type == "subscription" && tenantType == $tenantType && tenantId == $tenantId && (status == "active" || status == "trialing")][0] {
  _id,
  plan->{ limits },
  usage,
  status,
  trialStatus
}
`;

// Helper queries
export const TENANT_DOC_ID_BY_TYPE_AND_TENANT_ID_QUERY = `
*[_type == $tenantType && tenantId == $tenantId][0]._id
`;

export const TENANT_NAME_BY_TYPE_AND_TENANT_ID_QUERY = `
*[_type == $tenantType && tenantId == $tenantId][0].name
`;

// Payment queries
export const PAYMENT_BY_ID_QUERY = `
*[_type == "payment" && _id == $paymentId][0] {
  _id,
  subscription->{
    _id,
    tenantType,
    tenantId,
    plan->{ name, price }
  },
  amount,
  status,
  paymentMethod,
  transactionDate,
  stripePaymentId,
  stripeInvoiceId
}
`;
