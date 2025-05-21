import React, { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '' 
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        // Push the ad to Google AdSense
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const getAdFormat = () => {
    switch(adFormat) {
      case 'fluid':
        return { height: 'fluid' };
      case 'rectangle':
        return { height: '250px', width: '300px' };
      case 'horizontal':
        return { height: '90px', width: '728px' };
      case 'vertical':
        return { height: '600px', width: '160px' };
      case 'auto':
      default:
        return { height: 'auto' };
    }
  };

  const defaultStyle = {
    display: 'block',
    textAlign: 'center' as const,
    ...getAdFormat(),
    ...style
  };

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={defaultStyle}
        data-ad-client="ca-pub-1472258108326111"
        data-ad-slot={adSlot}
        data-ad-format={adFormat === 'fluid' ? 'fluid' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}