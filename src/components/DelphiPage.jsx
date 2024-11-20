import { Script } from 'next/script';
import React from 'react';

const DelphiPage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Main container for Delphi */}
      <div 
        id="delphi-container"
        className="w-full h-[93vh]"
      />

      {/* Configuration script */}
      <Script
        id="delphi-page-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.delphi = {...(window.delphi ?? {})};
            window.delphi.page = {
              config: "62c8cc36-65c2-452e-9161-acccf764ebb4",
              overrides: {
                landingPage: "OVERVIEW",
              },
              container: {
                width: "100%",
                height: "93vh",
              },
            };
          `
        }}
      />

      {/* Loader script */}
      <Script
        id="delphi-page-bootstrap"
        strategy="afterInteractive"
        src="https://embed.delphi.ai/loader.js"
      />
    </div>
  );
};

export default DelphiPage;