import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRef = document.querySelector('#modal-root');

export default function Modal({ imageURL, imageAlt, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleClose);
    return () => {
      window.removeEventListener('keydown', handleClose);
    };
  }, []);

  const handleClose = e => {
    if (e.code === 'Escape') {
      onClose(false);
    }
  };

  const handleCloseClick = e => {
    if (e.currentTarget === e.target) {
      onClose(false);
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={handleCloseClick}>
      <div className={s.Modal}>
        <img src={imageURL} alt={imageAlt} />
      </div>
    </div>,
    modalRef
  );
}
