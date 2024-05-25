import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faForwardStep,
  faBackwardStep,
  faPause,
  faVolumeHigh,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

import Song1 from "../Songs/Tum Prem Ho.mp3";
const MusicPlayer = () => {
  const [songs, setSongs] = useState([
    { title: "Tum Prem Ho", src: Song1 },
    { title: "Song 2", src: "song2.mp3" },
    { title: "Song 3", src: "song3.mp3" },
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const nextSong = () => {
    if (currentSongIndex === songs.length - 1) {
      setCurrentSongIndex(0);
    } else if (currentSongIndex !== null) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(songs.length - 1);
    } else if (currentSongIndex !== null) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const toggleMute = () => {
    if (!isMuted) {
      setPrevVolume(volume);
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="music-player">
      <h1>Music Player</h1>
      <div className="song-list">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`song-item ${
              currentSongIndex === index ? "active" : ""
            }`}
            onClick={() => playSong(index)}
          >
            {song.title}
          </div>
        ))}
      </div>
      <div className="player-controls">
        {currentSongIndex !== null && songs[currentSongIndex] && (
          <>
            <h2>{songs[currentSongIndex].title}</h2>
            <audio
              ref={audioRef}
              src={songs[currentSongIndex].src}
              onTimeUpdate={handleTimeUpdate}
            />
            <div className="controls">
              <button onClick={prevSong}>
                <FontAwesomeIcon icon={faBackwardStep} />
              </button>
              {isPlaying ? (
                <button onClick={pauseSong}>
                  <FontAwesomeIcon icon={faPause} />
                </button>
              ) : (
                <button onClick={() => playSong(currentSongIndex)}>
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              )}
              <button onClick={nextSong}>
                <FontAwesomeIcon icon={faForwardStep} />
              </button>
            </div>
            <span>{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <button onClick={toggleMute}>
                {isMuted ? (
                  <FontAwesomeIcon icon={faVolumeMute} />
                ) : (
                  <FontAwesomeIcon icon={faVolumeHigh} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
