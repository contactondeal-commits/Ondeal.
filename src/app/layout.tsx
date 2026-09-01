import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18380483895"
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18380483895');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
