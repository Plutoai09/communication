import React, { useEffect } from 'react';

const DelphiPage = () => {
  useEffect(() => {
    // Create and append the configuration script
    const configScript = document.createElement('script');
    configScript.id = 'delphi-page-script';
    configScript.innerHTML = `
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
    `;
    document.head.appendChild(configScript);

    // Create and append the loader script
    const loaderScript = document.createElement('script');
    loaderScript.id = 'delphi-page-bootstrap';
    loaderScript.src = 'https://embed.delphi.ai/loader.js';
    document.head.appendChild(loaderScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.head.removeChild(configScript);
      document.head.removeChild(loaderScript);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="w-full min-h-screen">
      <div 
        id="delphi-container"
        className="w-full h-[93vh]"
      />
    </div>
  );
};

export default DelphiPage;