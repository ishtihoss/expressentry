import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Express Entry Search Engine - Get accurate answers to your Express Entry Canada questions instantly" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11387636261"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11387636261');
          `}
        </Script>
        
        {/* Conversion tracking functions */}
        <Script id="conversion-tracking" strategy="afterInteractive">
          {`
            window.gtag_report_conversion = function(conversionType) {
              var eventParams = {};
              var sendTo = '';
              
              if (conversionType === 'default') {
                sendTo = 'AW-11387636261/01ZGCLj4-7MZEKWUhrYq';
              } else if (conversionType === 'subscription') {
                sendTo = 'AW-11387636261/ClBOCOHI3MEZEKWUhrYq';
                eventParams.transaction_id = ''; // You can set a dynamic transaction ID here if needed
              }
              
              gtag('event', 'conversion', {
                'send_to': sendTo,
                ...eventParams
              });
            }
          `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}