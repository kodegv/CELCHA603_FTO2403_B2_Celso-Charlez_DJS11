import { useRef, useState, useEffect } from 'react';
import { useAudioPlayer } from './AudioPlayerContext';
import DisplayTrack from './DisplayTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import { FaTimes } from 'react-icons/fa';
import './AudioPlayer.css';
import ConfirmModal from '../Modal/Modal';

const AudioPlayer: React.FC = () => {
  const { episode, playNextEpisode, playPrevEpisode, seasonImage } = useAudioPlayer();

  const [currentTrack, setCurrentTrack] = useState(episode);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentTrack(episode);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true)) 
        .catch((e) => console.log(e));
    }
  }, [episode]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.log(e));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleClosePlayer = () => {
    if (isPlaying) {
      setShowConfirmModal(true);
    } else {
      closePlayer();
      setIsPlaying(true);
    }
  };


  const closePlayer = () => {
    setCurrentTrack(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setShowConfirmModal(false);
  };

  const handleNext = () => {
    playNextEpisode();
    setIsPlaying(true);
  };

  const handlePrev = () => {
    playPrevEpisode();
    setIsPlaying(true);
  };

  if (!currentTrack) return null;

  return (
    <div className='player'>
      <div className="audio-player">
        <div className="inner">
          <button className="close-button" onClick={handleClosePlayer}><FaTimes /></button>
          <div className="track-info-section">
            <DisplayTrack
              currentTrack={currentTrack}
              audioRef={audioRef}
              setDuration={setDuration}
              progressBarRef={progressBarRef}
              handleNext={playNextEpisode}
              seasonImage={seasonImage}
            />
          </div>
          <Controls
            audioRef={audioRef}
            progressBarRef={progressBarRef}
            duration={duration}
            setTimeProgress={setTimeProgress}
            handleNext={handleNext}
            handlePrev={handlePrev}
            isPlaying={isPlaying}
            handlePlayPause={handlePlayPause}
          />
          <ProgressBar
            progressBarRef={progressBarRef}
            audioRef={audioRef}
            timeProgress={timeProgress}
            duration={duration}
            setTimeProgress={setTimeProgress}
            setIsPlaying={setIsPlaying}
          />
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        onConfirm={closePlayer}
        message=
        {`Audio is still playing. 
          \nAre you sure you want to close the player?`}
      />
      
    </div>
  );
};

export default AudioPlayer;