import React from "react";
import { Helmet } from "react-helmet";

export default function GoogleAnalytics() {
  return (
    <Helmet>
      {/* Google Analytics - Global site tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z56L7885CN"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-Z56L7885CN');
        `}
      </script>
    </Helmet>
  );
}