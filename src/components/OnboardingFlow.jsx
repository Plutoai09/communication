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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
        <div className="w-full max-w-xl text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Personalizing Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're crafting custom chapters based on your responses...
          </p>
          {/* Loading animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }}></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Let's start with your name";
      case 2: return "Tell us about your journey";
      case 3: return "What's your biggest communication challenge?";
      case 4: return "How has this affected your life?";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Answer 4 quick questions for a personalised learning journey";
      case 2: return "Share your current situation and where you want to be";
      case 3: return "Understanding your challenges helps us better guide you";
      case 4: return "Select all areas where you feel communication has held you back";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={responses.name}
              onChange={(e) => setResponses(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
              placeholder="Type your name here..."
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <textarea
              value={responses.currentAndNext}
              onChange={(e) => setResponses(prev => ({ ...prev, currentAndNext: e.target.value }))}
              className="w-full p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
              rows={4}
              placeholder="I'm currently... and I want to..."
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            {weaknessOptions.map((option) => (
              <div
                key={option}
                onClick={() => setResponses(prev => ({ ...prev, weakness: option }))}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
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
          <div className="space-y-3">
            {impactOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleImpactToggle(option)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center ${
                  responses.impacts.includes(option)
                    ? 'bg-blue-50 border-blue-500 shadow-md transform scale-[1.02]'
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {option}
                {responses.impacts.includes(option) && (
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
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

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  number === step
                    ? 'bg-blue-500 w-6'
                    : number < step
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              {getStepTitle()}
            </h2>
            <p className="text-gray-600">
              {getStepDescription()}
            </p>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isStepValid()
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Complete' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;