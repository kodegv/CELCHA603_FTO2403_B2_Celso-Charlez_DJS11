import { useEffect, useRef } from 'react';
// import { ProgressBarProps } from '../../utils/Interfaces';
import { UpdatedProgressBarProps } from '../../utils/Interfaces';
import './ProgressBar.css'


const ProgressBar: React.FC<UpdatedProgressBarProps> = ({
  progressBarRef,
  audioRef,
  timeProgress,
  duration,
  setTimeProgress,
  setIsPlaying,
}) => {

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        if (audioRef.current && progressBarRef.current) {
          const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          progressBarRef.current.style.width = `${percent}%`;
          setTimeProgress(audioRef.current.currentTime);
        }
      };

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [audioRef, progressBarRef, setTimeProgress]);


  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && audioRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setTimeProgress(newTime);

      // Play the audio if it was paused
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
    <div className="progress-container" ref={containerRef} onClick={handleProgressBarClick}>
      <div className="progress-bar" ref={progressBarRef} />
    </div>
    <div className="time-info">
        <span>{formatTime(timeProgress)}</span>  <span>{formatTime(duration)}</span>
      </div>
    
    </>
    
    
  );
};

export default ProgressBar;