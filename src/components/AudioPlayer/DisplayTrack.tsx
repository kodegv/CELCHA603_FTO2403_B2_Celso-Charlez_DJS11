import React, { useEffect } from 'react';
import { DisplayTrackProps } from '../../utils/Interfaces';

const DisplayTrack: React.FC<DisplayTrackProps> = ({
  currentTrack,
  audioRef,
  setDuration,
  handleNext,
  seasonImage,
}) => {
  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedData = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };

      const playAudio = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(error => console.error("Error playing the audio:", error));
        }
      };

      audioRef.current.addEventListener('loadeddata', handleLoadedData);

      // Pause the audio only if it's not already paused
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }

      audioRef.current.src = currentTrack.file;
      audioRef.current.load();

      audioRef.current.addEventListener('canplaythrough', playAudio);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadeddata', handleLoadedData);
          audioRef.current.removeEventListener('canplaythrough', playAudio);
        }
      };
    }
  }, [audioRef, currentTrack, setDuration]);

  return (
    <div className="display-track">
      <img src={currentTrack.image || seasonImage || 'default-image.jpg'} alt={currentTrack.title} className="track-image" />
      <div className="track-info">
        <h3 className="track-title">{currentTrack.title}</h3>
        {/* <p className="track-description">{currentTrack.description}</p> */}
      </div>
      <audio ref={audioRef} onEnded={handleNext} />
    </div>
  );
};

export default DisplayTrack;