import React, { useEffect, useRef, useState } from 'react';
import { useContentLanguage } from '../../context/ContentLanguageContext';
import TrillerVideoControls from './TrillerVideoControls';
import './TrillerModal.css';

const getLocalized = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return value[lang] || value.uz || value.ru || '';
  }
  return String(value);
};

const TrillerModal = ({ item, onClose }) => {
  const { contentLang } = useContentLanguage();
  const sheetRef = useRef(null);
  const handleRef = useRef(null);
  const videoRef = useRef(null);
  const startYRef = useRef(0);
  const dragYRef = useRef(0);
  const draggingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  const name = getLocalized(item?.name, contentLang);
  const description = getLocalized(item?.description, contentLang);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    video.play().catch(() => {
      setIsPlaying(false);
      setShowControls(true);
    });

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.pause();
    };
  }, [item?.trillerVideo]);

  const requestClose = () => {
    setClosing(true);
    videoRef.current?.pause();
    window.setTimeout(() => onClose?.(), 220);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    setShowControls(true);
  };

  useEffect(() => {
    const el = handleRef.current;
    if (!el) return undefined;

    const onStart = (e) => {
      const y = e.touches[0].clientY;
      startYRef.current = y;
      dragYRef.current = 0;
      draggingRef.current = true;
      setIsDragging(true);
      setDragY(0);
    };

    const onMove = (e) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = Math.max(0, y - startYRef.current);
      dragYRef.current = delta;
      setDragY(delta);
    };

    const onEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);

      const sheetHeight = sheetRef.current?.offsetHeight || window.innerHeight;
      const threshold = sheetHeight * 0.2;
      const delta = dragYRef.current;

      if (delta >= threshold) {
        requestClose();
      } else {
        dragYRef.current = 0;
        setDragY(0);
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  return (
    <div className={`triller-modal ${closing ? 'is-closing' : ''} ${isDragging ? 'is-dragging' : ''}`}>
      <button
        type="button"
        className="triller-modal-overlay"
        aria-label="Yopish"
        onClick={requestClose}
      />
      <div
        ref={sheetRef}
        className="triller-modal-sheet"
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : undefined,
        }}
      >
        <div ref={handleRef} className="triller-modal-handle-zone">
          <div className="triller-modal-handle" />
          <button type="button" className="triller-modal-close" onClick={requestClose} aria-label="Yopish">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="triller-modal-video-wrap">
          <video
            ref={videoRef}
            className="triller-modal-video"
            src={item?.trillerVideo || ''}
            playsInline
            preload="auto"
            onClick={() => setShowControls((v) => !v)}
          />
          <TrillerVideoControls
            videoRef={videoRef}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            show={showControls}
            onInteraction={() => setShowControls(true)}
          />
        </div>

        <div className="triller-modal-meta">
          {name ? <h3 className="triller-modal-name">{name}</h3> : null}
          {description ? <p className="triller-modal-description">{description}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default TrillerModal;
