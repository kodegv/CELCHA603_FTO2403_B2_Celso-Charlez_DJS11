import { createContext, useContext, useState, ReactNode } from "react";
import { AudioPlayerContextProps, Episode } from "../../utils/Interfaces";

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined)

export function AudioPlayerProvider({children}: { children: ReactNode }){
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [seasonImage, setSeasonImage] = useState<string | undefined>(undefined);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const playEpisode = (episode: Episode, seasonImage: string) => {
    setEpisode(episode);
    setSeasonImage(seasonImage);
  };

  const playNextEpisode = () => {
    if (!episode || episodes.length === 0) return;
    const currentIndex = episodes.findIndex((e) => e.episode === episode.episode);
    const nextIndex = (currentIndex + 1) % episodes.length;
    setEpisode(episodes[nextIndex]);
  };

  const playPrevEpisode = () => {
    if (!episode || episodes.length === 0) return;
    const currentIndex = episodes.findIndex((e) => e.episode === episode.episode);
    const prevIndex = (currentIndex - 1 + episodes.length) % episodes.length;
    setEpisode(episodes[prevIndex]);
  };


  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <AudioPlayerContext.Provider value={{
      episode,
      seasonImage,
      episodes,
      playEpisode,
      setEpisodes,
      playNextEpisode,
      playPrevEpisode,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer(){
    const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}