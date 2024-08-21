import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa";
import { TbRewindBackward10, TbRewindForward10  } from "react-icons/tb";
import { ControlsProps } from "../../utils/Interfaces";
import { useState, useEffect } from "react";
import { IoMdVolumeOff, IoMdVolumeHigh } from "react-icons/io";

import './Controls.css'

const Controls: React.FC<ControlsProps> = ({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  handleNext,
  handlePrev,
  isPlaying,
  handlePlayPause,
}) => {

  const [volume, setVolume] = useState<number>(() => {
    const savedVolume = localStorage.getItem('audio-player-volume');
    return savedVolume ? parseFloat(savedVolume) : 0.5; 
  });


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem('audio-player-volume', newVolume.toString());
  };


  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.volume === 0) {
        setVolume(1);
        audioRef.current.volume = 1;
        localStorage.setItem('audio-player-volume', '1');
      } else {
        setVolume(0);
        audioRef.current.volume = 0;
        localStorage.setItem('audio-player-volume', '0');
      }
    }
  };
 

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const handleProgress = () => {
    if (audioRef.current && progressBarRef.current) {
      const percent = (audioRef.current.currentTime / duration) * 100;
      progressBarRef.current.style.width = `${percent}%`;
      setTimeProgress(audioRef.current.currentTime);
    }
  };




  return (
    <div className="controls">
      <button onClick={handlePrev}><MdSkipPrevious /></button>
      <button onClick={handleRewind}><TbRewindBackward10 /></button>
      <button onClick={handlePlayPause}>
        {!isPlaying ? <FaPlay /> : <FaPause />}
      </button>
      <button onClick={handleFastForward}><TbRewindForward10 /></button>
      <button onClick={handleNext}><MdSkipNext /></button>
      <div ref={progressBarRef} className="progress-bar" onTimeUpdate={handleProgress} />
      
      <div className="volume-control-wrapper">
        <div className="volume-control">
          <div onClick={toggleMute}>
            {volume === 0 ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
          </div>
          <input
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;