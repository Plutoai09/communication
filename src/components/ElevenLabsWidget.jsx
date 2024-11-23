import React, { useEffect } from 'react';

const ElevenLabsWidget = () => {
  useEffect(() => {
    // Create and append the script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="w-full min-h-screen">
      <elevenlabs-convai 
        agent-id="gjXeuTR2Uf25WNrBWeul"
        className="w-full h-[92vh]"
      />
    </div>
  );
};

export default ElevenLabsWidget;