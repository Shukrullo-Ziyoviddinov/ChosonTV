import React, { useEffect, useRef, useState } from 'react';
import './TrillerVideoControls.css';

const TrillerVideoControls = ({
  videoRef,
  isPlaying,
  onPlayPause,
  show,
  onInteraction,
}) => {
  const hideTimerRef = useRef(null);
  const [localShow, setLocalShow] = useState(Boolean(show));

  useEffect(() => {
    setLocalShow(Boolean(show));
  }, [show]);

  const bump = () => {
    onInteraction?.();
    setLocalShow(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setLocalShow(false), 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setLocalShow(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      return;
    }
    bump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleBack10 = (e) => {
    e.stopPropagation();
    const video = videoRef?.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
    bump();
  };

  const handleForward10 = (e) => {
    e.stopPropagation();
    const video = videoRef?.current;
    if (!video) return;
    const duration = Number.isFinite(video.duration) ? video.duration : video.currentTime + 10;
    video.currentTime = Math.min(duration, video.currentTime + 10);
    bump();
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    onPlayPause?.();
    bump();
  };

  const visible = localShow || !isPlaying;

  return (
    <div
      className={`triller-video-controls ${visible ? 'show' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        bump();
      }}
    >
      <div className="triller-video-controls-center">
        <button
          type="button"
          className="triller-video-control-btn"
          onClick={handleBack10}
          aria-label="Orqaga 10 soniya"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            <text x="8" y="15" fill="white" fontSize="8" fontWeight="bold">
              10
            </text>
          </svg>
        </button>

        <button
          type="button"
          className="triller-video-control-btn triller-video-control-btn-play"
          onClick={handlePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {isPlaying ? (
              <>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </>
            ) : (
              <polygon points="5 3 19 12 5 21 5 3" />
            )}
          </svg>
        </button>

        <button
          type="button"
          className="triller-video-control-btn"
          onClick={handleForward10}
          aria-label="Oldinga 10 soniya"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
            <text x="8" y="15" fill="white" fontSize="8" fontWeight="bold">
              10
            </text>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TrillerVideoControls;
