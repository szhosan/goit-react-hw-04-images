import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';
import PropTypes from 'prop-types';

const modalRef = document.querySelector('#modal-root');

export default function Modal({ imageURL, imageAlt, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleClose);

    return () => {
      window.removeEventListener('keydown', handleClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const handleCloseClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
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

Modal.propTypes = {
  imageURL: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
