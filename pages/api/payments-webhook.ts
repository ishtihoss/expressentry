import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient'; // Assuming you're using Supabase

const VERIFIER_TOKEN = 'PtI1AFUbaxXHeHG4k8P+sNC0xRpZmd+r';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Verify the request is from Helcim
    if (req.headers['x-helcim-signature'] !== VERIFIER_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Process the webhook payload
    const payload = req.body;

    try {
      // Extract relevant information from the payload
      const { 
        event_type, 
        subscription_id, 
        customer_id, 
        status, 
        plan_id 
      } = payload;

      // Handle different event types
      switch (event_type) {
        case 'subscription_created':
        case 'subscription_updated':
          // Update or create subscription in your database
          await supabase
            .from('subscriptions')
            .upsert({ 
              subscription_id, 
              customer_id, 
              status, 
              plan_id 
            });
          break;

        case 'subscription_cancelled':
          // Update subscription status in your database
          await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .match({ subscription_id });
          break;

        case 'payment_succeeded':
          // Update payment status in your database
          // You might want to create a new entry in a 'payments' table
          await supabase
            .from('payments')
            .insert({ 
              subscription_id, 
              customer_id, 
              status: 'succeeded',
              amount: payload.amount,
              currency: payload.currency
            });
          break;

        case 'payment_failed':
          // Handle failed payment
          // You might want to notify the user or update subscription status
          await supabase
            .from('payments')
            .insert({ 
              subscription_id, 
              customer_id, 
              status: 'failed',
              amount: payload.amount,
              currency: payload.currency
            });
          // Optionally update subscription status
          break;

        // Add more cases as needed

        default:
          console.log(`Unhandled event type: ${event_type}`);
      }

      res.status(200).json({ received: true, processed: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}