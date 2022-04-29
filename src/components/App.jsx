import { useEffect, useState } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from 'components/Button/Button';
import { ThreeDots } from 'react-loader-spinner';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  fetchPhotos,
  PHOTOS_PER_PAGE,
} from '../utils/PhotoService/PhotoService';
import Notification from './Notification/Notification';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [galleryItems, setGalleryItems] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageId, setModalImageId] = useState(null);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setStatus(Status.PENDING);
    fetchPhotos(searchQuery, page).then(response => {
      const requestedPhotosAmount = response.data.totalHits;
      if (requestedPhotosAmount === 0) {
        setStatus(status.REJECTED);
        Notify.failure(
          `There is no photos on your search query: ${searchQuery}`
        );
        return;
      }
      const receivedItems = response.data.hits.map(
        ({ id, largeImageURL, webformatURL, tags }) => {
          return {
            id,
            largeImageURL,
            webformatURL,
            tags,
          };
        }
      );
      if (page > 1) {
        setGalleryItems(prevItems => [...prevItems, ...receivedItems]);
      } else {
        setGalleryItems(receivedItems);
        Notify.success(
          `There is ${requestedPhotosAmount} photos on your query - ${searchQuery}`
        );
      }
      const canLoadMore = page * PHOTOS_PER_PAGE < requestedPhotosAmount;
      setCanLoadMore(canLoadMore);
      if (!canLoadMore) {
        Notify.info(
          `You have reached the end of found photos of your request - ${searchQuery}`
        );
      }
      setStatus(Status.RESOLVED);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  const handleSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
  };

  const handleGalleryItemClick = id => {
    setModalImageId(id);
    toggleModal();
  };

  const setModalImageURL = id => {
    return galleryItems.find(galleryItem => galleryItem.id === id);
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const setNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const modalImageItem = setModalImageURL(modalImageId);

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      {status === Status.IDLE && (
        <Notification message="Input your search query to the field above" />
      )}
      {galleryItems && (
        <ImageGallery
          galleryItems={galleryItems}
          onGalleryItemClick={handleGalleryItemClick}
        />
      )}
      {showModal && (
        <Modal
          imageURL={modalImageItem.largeImageURL}
          imageAlt={modalImageItem.tags}
          onClose={toggleModal}
        />
      )}
      <div className="footerContainer">
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

export default App;
