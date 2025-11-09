import Stripe from "stripe"
console.log("Stripe Secret Key:", process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)