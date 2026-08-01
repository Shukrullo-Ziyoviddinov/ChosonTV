import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const getItemKey = (item) => item?.trillerId ?? item?.id;

const TrillerModal = ({ item, items = [], onSelect, onClose }) => {
  const { contentLang } = useContentLanguage();
  const sheetRef = useRef(null);
  const handleRef = useRef(null);
  const videoRef = useRef(null);
  const startYRef = useRef(0);
  const dragYRef = useRef(0);
  const draggingRef = useRef(false);
  const closingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dragClose, setDragClose] = useState(false);

  const activeKey = getItemKey(item);
  const name = getLocalized(item?.name, contentLang);
  const description = getLocalized(item?.description, contentLang);
  const listItems = Array.isArray(items) && items.length ? items : item ? [item] : [];

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

    setShowControls(true);
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
  }, [item?.trillerVideo, activeKey]);

  const requestClose = useCallback((options = {}) => {
    if (closingRef.current) return;
    closingRef.current = true;
    const fromDrag = Boolean(options.fromDrag);
    setClosing(true);
    videoRef.current?.pause();

    if (fromDrag) {
      setDragClose(true);
      const h = sheetRef.current?.offsetHeight || window.innerHeight;
      setDragY(Math.max(dragYRef.current, h));
    }

    window.setTimeout(() => onClose?.(), 240);
  }, [onClose]);

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
      if (closingRef.current) return;
      if (window.innerWidth > 768) return;
      const y = e.touches[0].clientY;
      startYRef.current = y;
      dragYRef.current = 0;
      draggingRef.current = true;
      setIsDragging(true);
      setDragY(0);
    };

    const onMove = (e) => {
      if (!draggingRef.current || closingRef.current) return;
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
        requestClose({ fromDrag: true });
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
  }, [requestClose]);

  const sheetTransform =
    dragY > 0 || dragClose
      ? `translateY(${dragY}px)`
      : undefined;

  return (
    <div
      className={[
        'triller-modal',
        closing ? 'is-closing' : '',
        isDragging ? 'is-dragging' : '',
        dragClose ? 'is-drag-close' : '',
      ].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="triller-modal-overlay"
        aria-label="Yopish"
        onClick={() => requestClose()}
      />
      <div
        ref={sheetRef}
        className="triller-modal-sheet"
        style={{
          transform: sheetTransform,
          transition: isDragging ? 'none' : undefined,
        }}
      >
        <div ref={handleRef} className="triller-modal-handle-zone">
          <div className="triller-modal-handle" aria-hidden />
          <button
            type="button"
            className="triller-modal-close"
            onClick={() => requestClose()}
            aria-label="Yopish"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="triller-modal-content">
          <div className="triller-modal-main">
            <div className="triller-modal-video-wrap">
              <video
                key={activeKey}
                ref={videoRef}
                className="triller-modal-video"
                src={item?.trillerVideo ? encodeURI(item.trillerVideo) : ''}
                playsInline
                preload="auto"
                onClick={() => setShowControls((v) => !v)}
              />
              <TrillerVideoControls
                videoRef={videoRef}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                show={showControls}
                onToggle={() => setShowControls((v) => !v)}
                onInteraction={() => setShowControls(true)}
              />
            </div>

            <div className="triller-modal-meta">
              {name ? <h3 className="triller-modal-name">{name}</h3> : null}
              {description ? <p className="triller-modal-description">{description}</p> : null}
            </div>
          </div>

          {listItems.length > 0 ? (
            <div className="triller-modal-list">
              {listItems.map((row) => {
                const key = getItemKey(row);
                const isActive = key === activeKey;
                const rowName = getLocalized(row?.name, contentLang);
                const rowDesc = getLocalized(row?.description, contentLang);
                const imgSrc = row?.img ? encodeURI(row.img) : '';

                return (
                  <button
                    key={key}
                    type="button"
                    className={`triller-modal-list-item${isActive ? ' is-active' : ''}`}
                    onClick={() => {
                      if (!isActive) onSelect?.(row);
                    }}
                  >
                    <div className="triller-modal-list-thumb">
                      {imgSrc ? (
                        <img src={imgSrc} alt={rowName || ''} loading="lazy" />
                      ) : (
                        <span className="triller-modal-list-thumb-empty" />
                      )}
                    </div>
                    <div className="triller-modal-list-info">
                      {rowName ? <p className="triller-modal-list-name">{rowName}</p> : null}
                      {rowDesc ? <p className="triller-modal-list-description">{rowDesc}</p> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TrillerModal;
