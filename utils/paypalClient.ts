const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function getPayPalAccessToken(): Promise<string> {
  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw new Error('Failed to obtain PayPal access token');
  }
}

export async function cancelPayPalSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        reason: 'Customer requested cancellation'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: `PayPal API error: ${response.status} - ${errorData.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling PayPal subscription:', error);
    return { success: false, error: 'An unexpected error occurred while cancelling the subscription' };
  }
}