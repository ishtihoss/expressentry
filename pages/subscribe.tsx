import { useEffect } from 'react';

export default function SubscribePage() {
  useEffect(() => {
    window.location.href = 'https://subscriptions.helcim.com/subscribe/f9jowwi2y0g7xrvcr6ytef1s1hmkw';
  }, []);

  return <div>Redirecting to subscription page...</div>;
}