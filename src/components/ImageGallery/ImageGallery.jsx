import { useEffect } from 'react';
import s from './ImageGallery.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import { Events, animateScroll as scroll } from 'react-scroll';
import PropTypes from 'prop-types';

function ImageGallery({ galleryItems, onGalleryItemClick }) {
  useEffect(() => {
    Events.scrollEvent.register('begin', function () {
      //console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function () {
      //console.log('end', arguments);
    });

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  useEffect(() => {
    scroll.scrollToBottom();
  }, [galleryItems]);

  const onGalleryClick = id => {
    onGalleryItemClick(id);
  };

  return (
    <>
      <ul className={s.ImageGallery}>
        {galleryItems.map(({ id, webformatURL, tags }) => {
          return (
            <ImageGalleryItem
              key={id}
              id={id}
              webformatURL={webformatURL}
              tags={tags}
              onItemClick={() => onGalleryClick(id)}
            />
          );
        })}
      </ul>
    </>
  );
}

ImageGallery.propTypes = {
  galleryItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    })
  ),
  onGalleryItemClick: PropTypes.func.isRequired,
};

export default ImageGallery;
