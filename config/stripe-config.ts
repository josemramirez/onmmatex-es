// CHECKOUT
export const checkoutUrls = {
  success_url: `${process.env.HOME_URL}/dashboard`,
  cancel_url: `${process.env.HOME_URL}/#pricing`
};

// BILLING PORTAL
export const billingReturnUrl = `${process.env.HOME_URL}/dashboard/subscription`;