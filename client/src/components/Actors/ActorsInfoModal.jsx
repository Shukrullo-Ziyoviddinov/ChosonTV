import React, { useEffect } from 'react';
import './ActorsInfoModal.css';

const ActorsInfoModal = ({ title, text, onClose }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <>
      <div className="actors-info-modal-overlay" onClick={onClose} aria-hidden="true" />
      <div
        className="actors-info-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="actors-info-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="actors-info-modal-header">
          <h3 id="actors-info-modal-title" className="actors-info-modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="actors-info-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="actors-info-modal-body">
          <p className="actors-info-modal-text">{text}</p>
        </div>
      </div>
    </>
  );
};

export default ActorsInfoModal;
