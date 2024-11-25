import React, { useEffect, useState, useRef } from 'react';
import { useConversation } from '@11labs/react';
import { PhoneCall, XCircle } from 'lucide-react';

const ElevenLabsConversation = () => {
  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const videoRef = useRef(null);
  const hasGreeted = useRef(false);

  const conversation = useConversation({
    onConnect: async () => {
      console.log('Connected to ElevenLabs');
      if (isActive && !hasGreeted.current) {
        hasGreeted.current = true;
        try {
          await conversation.sendTextMessage("Hello! I'm your AI assistant. How can I help you today?");
        } catch (error) {
          console.error('Failed to send greeting:', error);
        }
      }
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      hasGreeted.current = false;
      handleCleanup();
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      hasGreeted.current = false;
      setIsActive(false);
      handleCleanup();
    },
  });

  const { status, isSpeaking } = conversation;

  // Remove initial mic permission request useEffect

  const handleCleanup = () => {
    setIsCleaningUp(true);
    setTimeout(() => {
      setIsActive(false);
      setIsCleaningUp(false);
    }, 100);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error autoplaying video:', error);
      });
    }
  }, []);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicAllowed(true);
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      setIsMicAllowed(false);
      return false;
    }
  };

  const handleToggleCall = async () => {
    if (isActive) {
      try {
        hasGreeted.current = false;
        await conversation.endSession();
        handleCleanup();
      } catch (error) {
        console.error('Failed to end conversation:', error);
        handleCleanup();
      }
    } else {
      try {
        // Request mic permission before starting the session
        setIsInitializing(true);
        const micPermissionGranted = await requestMicPermission();
        
        if (!micPermissionGranted) {
          setIsInitializing(false);
          return;
        }

        setIsActive(true);
        const conversationId = await conversation.startSession({
          agentId: 'gjXeuTR2Uf25WNrBWeul',
        });
        console.log('Started conversation with ID:', conversationId);
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to start conversation:', error);
        setIsActive(false);
        setIsInitializing(false);
        handleCleanup();
      }
    }
  };

  const isConnected = status === 'connected' && isActive;

  const getStatusText = () => {
    if (isInitializing) return 'Initializing...';
    if (!isConnected) return 'AI Powered Tips';
    if (isSpeaking) return 'Talking...';
    return 'Listening...';
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
                src="/videos/circle-animation.mp4"
                style={{
                  maskImage: 'radial-gradient(circle, black 70%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 70%)',
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1">
            <p className="text-base text-gray-900 mb-3">
              {getStatusText()}
            </p>

            <button
              onClick={handleToggleCall}
              disabled={isCleaningUp || isInitializing}
              className={`
                flex items-center justify-center px-4 py-1.5 rounded-full font-medium text-sm
                transition-all duration-200 ease-in-out
                ${isConnected
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-black text-white hover:bg-gray-800 hover:shadow-sm'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className="mr-2">
                {isConnected ? <XCircle size={16} /> : <PhoneCall size={16} />}
              </span>
              {isConnected ? 'End' : 'Ask'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevenLabsConversation;