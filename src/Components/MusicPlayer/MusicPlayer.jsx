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
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import albumCover from "../Icons/album-pic.png";

import Song1 from "../Songs/Tum Prem Ho.mp3";
import Song2 from "../Songs/Gumaan.mp3";
import Song3 from "../Songs/Khayaal.mp3";
import Song4 from "../Songs/Khel.mp3";
import Song5 from "../Songs/Shikayat.mp3";
import Song6 from "../Songs/Dancing With Your Ghost.mp3";
import Song7 from "../Songs/Dandelions  Ruth B..mp3";
import Song8 from "../Songs/Ghost  Justin Bieber.mp3";
import Song9 from "../Songs/Love Is Gone  ( Acoustic )  SLANDER.mp3";
import Song10 from "../Songs/STAY (with Justin Bieber).mp3";

const SongInfo = ({ title }) => (
  <div className="song-info">
    <img className="album-cover" src={albumCover} alt="Default Album Cover" />
    <div className="song-details">
      <h2>{title}</h2>
    </div>
  </div>
);

const MusicPlayer = () => {
  const [songs, setSongs] = useState([
    { title: "Tum Prem Ho", src: Song1 },
    { title: "Gumaan", src: Song2 },
    { title: "Khayaal", src: Song3 },
    { title: "Khel", src: Song4 },
    { title: "Shikayat", src: Song5 },
    { title: "STAY", src: Song6 },
    { title: "Ghost", src: Song7 },
    { title: "Dandelions", src: Song8 },
    { title: "Love Is Gone", src: Song9 },
    { title: "Dancing With Your Ghost", src: Song10 },
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = isLooping;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [volume, isMuted, isPlaying, isLooping]);

  const playSong = (index) => {
    if (index === currentSongIndex) {
      if (isPlaying) {
        pauseSong();
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    setCurrentSongIndex(index);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.src = songs[index].src;

      audioRef.current.addEventListener(
        "canplaythrough",
        () => {
          audioRef.current.play();
        },
        { once: true }
      );
    }
  };
  const pauseSong = () => {
    setIsPlaying(false);
  };

  const nextSong = () => {
    if (currentSongIndex === songs.length - 1) {
      setCurrentSongIndex(0);
      playSong(0);
    } else if (currentSongIndex !== null) {
      setCurrentSongIndex(currentSongIndex + 1);
      playSong(currentSongIndex + 1);
    }
  };
  const prevSong = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(songs.length - 1);
      playSong(songs.length - 1);
    } else if (currentSongIndex !== null) {
      setCurrentSongIndex(currentSongIndex - 1);
      playSong(currentSongIndex - 1);
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

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  // const handleSeek = (e) => {
  //   if (audioRef.current) {
  //     const seekTime = (e.target.value / 100) * audioRef.current.duration;
  //     audioRef.current.currentTime = seekTime;
  //     setCurrentTime(seekTime);
  //   }
  // };

  return (
    <div className="music-player">
      <div className="header">
        <h1>Meloholic</h1>
      </div>

      <div className="content">
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
              <SongInfo title={songs[currentSongIndex].title} />
              <audio
                ref={audioRef}
                src={songs[currentSongIndex].src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
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
                <button onClick={toggleLoop}>
                  {isLooping ? (
                    <FontAwesomeIcon icon={faRepeat} />
                  ) : (
                    <FontAwesomeIcon
                      icon={faRepeat}
                      rotation={180}
                      style={{ color: "#505050" }}
                    />
                  )}
                </button>
              </div>

              <div className="progress-bar">
                <span>{formatTime(currentTime)}</span>
                <div className="bar">
                  <div
                    className="progress-indicator"
                    style={{
                      left: `${
                        (currentTime / audioRef.current?.duration) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span>{formatTime(audioRef.current?.duration || 0)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="footer">
        <div className="additional-controls">
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
      </div>
    </div>
  );
};

export default MusicPlayer;
