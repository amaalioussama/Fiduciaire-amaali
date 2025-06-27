export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "name": "Fiduam",
    "alternateName": "Cabinet Fiduciaire Fiduam",
    "description": "Cabinet fiduciaire et comptable à Agadir, spécialisé dans les services juridiques, comptables et sociaux pour entreprises au Maroc.",
    "url": "https://fiduam.com",
    "logo": "https://fiduam.com/elevate.png",
    "image": "https://fiduam.com/hero.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "N°10, 1er Etage, Imam El Boukhari Bouargane",
      "addressLocality": "Agadir",
      "postalCode": "80000",
      "addressCountry": "MA"
    },
    "telephone": "+212528220403",
    "email": "contact@fiduam.com",
    "openingHours": [
      "Mo-Fr 09:00-17:00",
      "Sa 09:00-13:00"
    ],
    "closed": "Su",
    "areaServed": {
      "@type": "City",
      "name": "Agadir"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Morocco"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services Fiduciaire et Comptable",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Services Juridiques",
            "description": "Création d'entreprise et démarches juridiques"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Services Comptables",
            "description": "Comptabilité et fiscalité pour entreprises"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Services Sociaux",
            "description": "Gestion sociale et administrative des employés"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/fiduam",
      "https://www.instagram.com/fiduam",
      "https://www.linkedin.com/company/fiduam"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 