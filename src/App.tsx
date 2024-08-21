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
  }