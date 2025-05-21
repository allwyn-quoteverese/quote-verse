import { Helmet } from 'react-helmet';

export default function AdSenseHead() {
  return (
    <Helmet>
      {/* Google AdSense Verification Code */}
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1472258108326111" 
        crossOrigin="anonymous"
      />
    </Helmet>
  );
}