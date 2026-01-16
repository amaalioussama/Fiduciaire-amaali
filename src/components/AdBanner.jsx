'use client';

import { useEffect } from 'react';

export default function AdBanner({ slot, format = 'auto' }) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't render if no AdSense ID is configured
  if (!adSenseId) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-4 text-center text-gray-400 text-sm">
        <p>Espace publicitaire</p>
        <p className="text-xs mt-1">Configurez NEXT_PUBLIC_ADSENSE_ID pour activer les pubs</p>
      </div>
    );
  }

  const getAdStyle = () => {
    switch (format) {
      case 'horizontal':
        return { display: 'block', width: '100%', height: '90px' };
      case 'rectangle':
        return { display: 'block', width: '300px', height: '250px', margin: '0 auto' };
      case 'vertical':
        return { display: 'block', width: '160px', height: '600px' };
      default:
        return { display: 'block' };
    }
  };

  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={getAdStyle()}
        data-ad-client={adSenseId}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'horizontal' ? 'true' : undefined}
      />
    </div>
  );
}
