export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nexoura Digital Agency",
    "url": "https://nexoura.com",
    "logo": "https://nexoura.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+201152628515",
      "contactType": "customer service",
      "areaServed": "Worldwide",
      "availableLanguage": ["en", "ar"]
    },
    "sameAs": [
      "https://facebook.com/nexoura",
      "https://twitter.com/nexoura",
      "https://instagram.com/nexoura"
    ],
    "description": "Premium digital agency building cinematic digital experiences, custom websites, and ready-made templates."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
