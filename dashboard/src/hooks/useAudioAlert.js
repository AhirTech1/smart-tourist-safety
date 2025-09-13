import { useCallback, useRef } from 'react';

export const useAudioAlert = () => {
  const audioContextRef = useRef(null);
  
  const playAlertSound = useCallback(() => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Create a beep sound using Web Audio API
      const createBeep = (frequency, duration, type = 'sine') => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };
      
      // Play alert sound pattern: three urgent beeps
      createBeep(800, 0.3); // High pitch
      setTimeout(() => createBeep(600, 0.3), 400); // Medium pitch
      setTimeout(() => createBeep(800, 0.5), 800); // High pitch longer
      
    } catch (error) {
      console.error('Error playing alert sound:', error);
      // Fallback: try to play a simple beep
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFApGn+DyvmUcBjiRzvLNeSsFJHfH8N2QQAoUXbPp66hWFA==');
        audio.play();
      } catch (fallbackError) {
        console.error('Fallback audio also failed:', fallbackError);
      }
    }
  }, []);

  return { playAlertSound };
};
