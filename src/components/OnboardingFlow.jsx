import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const [responses, setResponses] = useState({
    name: '',
    currentAndNext: '',
    weakness: '',
    impacts: []
  });

  const weaknessOptions = [
    'I struggle to find the right words to express myself',
    'I feel nervous during interviews and formal conversations',
    'I get anxious speaking in front of groups',
    'I find it difficult to speak spontaneously'
  ];

  const impactOptions = [
    'Building meaningful friendships and professional networks',
    'Maintaining personal relationships and connections',
    'Advancing in my career and professional growth',
    'Developing confidence and self-belief'
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`/videos/audio${step}.mp3`);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);

    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => setIsPlaying(false));
    }
  }, [step]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        Name: responses.name,
        First: responses.currentAndNext,
        Second: responses.weakness,
        Third: responses.impacts.join(', ')
      };

      await fetch('https://contractus.co.in/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      // Wait for 3 seconds to show loading animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      localStorage.setItem('onboardingResponses', JSON.stringify(responses));
      navigate('/artofconversation');
    } catch (error) {
      console.error('Error submitting responses:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleImpactToggle = (impact) => {
    setResponses(prev => ({
      ...prev,
      impacts: prev.impacts.includes(impact)
        ? prev.impacts.filter(i => i !== impact)
        : [...prev.impacts, impact]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return responses.name.trim().length > 0;
      case 2: return responses.currentAndNext.trim().length > 0;
      case 3: return responses.weakness !== '';
      case 4: return responses.impacts.length > 0;
      default: return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="w-full max-w-xs text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Personalizing Your Journey
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Crafting custom chapters based on your responses...
          </p>
          {/* Loading animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }}></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Your Name";
      case 2: return "Your Journey";
      case 3: return "Communication Challenge";
      case 4: return "Life Impacts";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "4 quick questions for a personalized learning path";
      case 2: return "Share your current and desired communication state";
      case 3: return "What challenges you most?";
      case 4: return "Select areas where communication has held you back";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={responses.name}
              onChange={(e) => setResponses(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 text-base border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
              placeholder="Your name..."
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <textarea
              value={responses.currentAndNext}
              onChange={(e) => setResponses(prev => ({ ...prev, currentAndNext: e.target.value }))}
              className="w-full p-3 text-base border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
              rows={3}
              placeholder="I'm currently... and I want to..."
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-2">
            {weaknessOptions.map((option) => (
              <div
                key={option}
                onClick={() => setResponses(prev => ({ ...prev, weakness: option }))}
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 text-sm ${
                  responses.weakness === option
                    ? 'bg-blue-50 border-blue-500 shadow-md transform scale-[1.02]'
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-2">
            {impactOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleImpactToggle(option)}
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center text-sm ${
                  responses.impacts.includes(option)
                    ? 'bg-blue-50 border-blue-500 shadow-md transform scale-[1.02]'
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {option}
                {responses.impacts.includes(option) && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="onboarding-container">
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="logo"
        />
        {isPlaying && (
          <div className="ripple" />
        )}
      </div>

      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl">
        <div className="p-4">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                  number === step
                    ? 'bg-blue-500 w-5'
                    : number < step
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">
              {getStepTitle()}
            </h2>
            <p className="text-xs text-gray-600">
              {getStepDescription()}
            </p>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`ml-auto flex items-center gap-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                isStepValid()
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;