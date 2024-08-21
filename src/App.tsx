import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollUp';

import Header from "./components/Header/Header";

import Shows from "./pages/Shows/Shows";
import ShowDetail from './pages/ShowDetail/ShowDetail';
import SeasonDetail from './pages/SeasonDetail/SeasonDetail';
import { AudioPlayerProvider } from './components/AudioPlayer/AudioPlayerContext';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';

import Favourites from "./pages/Favourites/Favourites";
import Genres from "./pages/Genres/Genres";
import GenreDetail from './pages/GenresDetail/GenreDetail';


import './App.css' // global styling
import './styles/themes.css'



const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  return savedTheme ? savedTheme : 'dark';
};

export default function App() {

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);


  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  


  return (
  <AudioPlayerProvider> 
    <Router>
      <Header 
        toggleTheme={toggleTheme} 
        theme={theme}
      />
      <div className='body-content'>
      <ScrollToTop>
      <Routes>
              <Route path="/" element={<Shows/>} />
              <Route path="show/:id" element={<ShowDetail />}>
                <Route path="season/:seasonId" element={<SeasonDetail />} />
              </Route>
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/genre/:genreSlug" element={<GenreDetail />} />
            </Routes>
        </ScrollToTop>
      </div>
      <AudioPlayer />
    </Router>  
  </AudioPlayerProvider>
  )
}
