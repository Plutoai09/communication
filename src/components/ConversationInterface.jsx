import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ConversationInterface = () => {
  const [inputText, setInputText] = useState('');
  const [audioResponse, setAudioResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Improved base64 to blob conversion
  const base64ToBlob = (base64) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'audio/mp3' });
    } catch (error) {
      console.error('Base64 to Blob Conversion Error:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/converse', {
        text: inputText
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.audio) {
        // Debugging: Log base64 string length
        console.log('Base64 Audio Length:', response.data.audio.length);

        const audioBlob = base64ToBlob(response.data.audio);
        
        if (audioBlob) {
          console.log('Audio Blob Size:', audioBlob.size);

          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioResponse(audioUrl);

          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            
            // Comprehensive error and metadata logging
            audioRef.current.addEventListener('error', (e) => {
              console.error('Audio Element Error:', e);
              setError('Failed to load audio');
            });
            
            audioRef.current.addEventListener('loadedmetadata', () => {
              console.log('Audio Duration:', audioRef.current.duration);
              console.log('Audio Ready State:', audioRef.current.readyState);
            });
            
            try {
              await audioRef.current.play();
            } catch (playError) {
              console.error('Audio Play Error:', playError);
              setError('Could not play audio');
            }
          }
        } else {
          setError('Failed to convert audio blob');
        }
      } else {
        setError('No audio response received');
      }
    } catch (error) {
      console.error('Conversation Error:', error);
      setError(error.response?.data?.error || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">AI Conversation</h1>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your message"
          className="flex-grow p-2 border rounded"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading || !inputText}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {audioResponse && (
        <div className="mt-4">
          <audio 
            ref={audioRef} 
            controls 
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default ConversationInterface;