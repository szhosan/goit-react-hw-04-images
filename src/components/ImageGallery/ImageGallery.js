import { useEffect, useState, useRef } from 'react';
import s from './ImageGallery.module.css';
import PhotoApiService from '../PhotoService/PhotoService';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import Button from 'components/Button/Button';
import Modal from '../Modal/Modal';
import { ThreeDots } from 'react-loader-spinner';
import { Events, animateScroll as scroll } from 'react-scroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function ImageGallery({ searchQuery }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [loadNextPage, setLoadNextPage] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageID, setModalImageID] = useState(null);

  const instance = useRef(new PhotoApiService());

  useEffect(() => {
    Events.scrollEvent.register('begin', function () {
      //console.log('begin', arguments);
    });

    Events.scrollEvent.register('end', function () {
      //console.log('end', arguments);
    });

    async function fetch() {
      instance.current.searchQuery = searchQuery;
      setGalleryItemsData(await instance.current.getPhotos());
    }

    fetch();

    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  useEffect(() => {
    setStatus(Status.PENDING);
    instance.current.searchQuery = searchQuery;
    instance.current.resetPage();
    async function fetch() {
      setGalleryItemsData(await instance.current.getPhotos(), false);
    }
    fetch();
  }, [searchQuery]);

  useEffect(() => {
    if (!loadNextPage) {
      return;
    }
    setStatus(Status.PENDING);
    async function fetch() {
      setGalleryItemsData(await instance.current.getPhotos(), true);
    }
    fetch();
  }, [loadNextPage]);

  function setGalleryItemsData({ data }, nextPageLoading) {
    if (data.totalHits === 0) {
      setStatus(Status.REJECTED);
      return;
    }
    const result = data.hits.map(
      ({ id, largeImageURL, webformatURL, tags }) => {
        return {
          id,
          largeImageURL,
          webformatURL,
          tags,
        };
      }
    );

    const canLoadNextPage = !instance.current.areAllRequestedPhotosShown();
    if (nextPageLoading) {
      setGalleryItems(prevItems => [...prevItems, ...result]);
      setStatus(Status.RESOLVED);
      setCanLoadMore(canLoadNextPage);
      setLoadNextPage(false);
      return;
    }
    setGalleryItems(result);
    setStatus(Status.RESOLVED);
    setCanLoadMore(canLoadNextPage);
    setLoadNextPage(false);
  }

  const setNextPage = () => {
    instance.current.incrementPage();
    setLoadNextPage(true);
    scroll.scrollToBottom();
  };

  const onGalleryClick = id => {
    setModalImageID(id);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(prevValue => !prevValue);
  };

  const setModalImageURL = () => {
    if (setModalImageURL) {
      const galleryItem = galleryItems.find(item => item.id === modalImageID);
      return galleryItem;
    }
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
              onItemClick={onGalleryClick}
            />
          );
        })}
      </ul>

      {status === Status.REJECTED &&
        Notify.warning(
          `There is no photos on your search query: ${searchQuery}`
        )}
      {showModal && (
        <Modal
          imageURL={setModalImageURL().largeImageURL}
          imageAlt={setModalImageURL().tags}
          onClose={toggleModal}
        />
      )}

      <div className={s.footerContainer}>
        {canLoadMore && status !== Status.PENDING && (
          <Button onClick={setNextPage} />
        )}
        {status === Status.PENDING && (
          <ThreeDots color="#3f51b5" ariaLabel="loading" />
        )}
      </div>
    </>
  );
}

export default ImageGallery;
