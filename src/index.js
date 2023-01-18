import './css/styles.css';
import './css/image-filter.css';
import ImagesFilterApi from './js/pixabay-sevise';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imagesFilterApi = new ImagesFilterApi();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});
// lightbox.refresh()
let inputSearchQuery = '';
let countHits = 0;

const refs = {
  input: document.querySelector('input[name="searchQuery"]'),
  searchForm: document.querySelector('.js-search-form'),
  loadMoreBtn: document.querySelector('button.js-load-more'),
  gallery: document.querySelector('.gallery'),
  sentinel: document.querySelector('#sentinel'),
};
console.log(refs.searchForm);

refs.searchForm.addEventListener('submit', onSearchImages);
refs.input.addEventListener('input', onInputChange);
refs.loadMoreBtn.addEventListener('click', fetchImages);

function onSearchImages(e) {
  e.preventDefault();

  disableLoadMdorBtn();
  clearImagesContainer();
  imagesFilterApi.query = inputSearchQuery;

  fetchImages();
}

function fetchImages() {
  imagesFilterApi
    .fetchImages()
    .then(r => {
      onFetchError(r);
      createImagesListMarkup(r);
      enableLoadMdorBtn();
      ifTheEndOfTheCollection(r);
      lightbox.refresh();
    })
    .catch(onFetchError);
  //
  console.log(countHits);
}

function ifTheEndOfTheCollection(data) {
  const totalHits = data.totalHits;
  const message = "We're sorry, but you've reached the end of search results.";
  if (countHits >= totalHits) {
    disableLoadMdorBtn();
    Notiflix.Notify.info(message);
  }
}

function enableLoadMdorBtn() {
  refs.loadMoreBtn.disabled = false;
}

function disableLoadMdorBtn() {
  refs.loadMoreBtn.disabled = true;
}

function clearImagesContainer() {
  refs.gallery.innerHTML = '';
}

function onFetchError(data) {
  const emptyRequest = inputSearchQuery === '';
  const invalidRequest = data.hits.length < 1;
  const message = `Sorry, there are no images matching your search query. Please try again.`;

  if (emptyRequest || invalidRequest) {
    Notiflix.Notify.failure(message);
    return;
  }
}

function onInputChange(e) {
  inputSearchQuery = e.target.value.trim();
}

function createImagesListMarkup(images) {
  countHits += images.hits.length;

  // width="100px"
  let counriesMarkup = ``;
  images.hits.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const markup = `
<div class='gallery__item'>
  <a class='gallery__image' href='${largeImageURL}'>
    <img
      class=''
      src='${webformatURL}'
      alt='${tags}'
      loading='lazy'
    />
    <div class='gallery__info'>
      <p class='gallery__info--item'>
        <b>Likes</b>${likes}
      </p>
      <p class='gallery__info--item'>
        <b>Views</b>${views}
      </p>
      <p class='gallery__info--item'>
        <b>Comments</b>${comments}
      </p>
      <p class='gallery__info--item'>
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </a>
</div>`;

      //   <div class='photo-card'>
      //   </div>
      counriesMarkup += markup;
    }
  );

  refs.gallery.insertAdjacentHTML('beforeend', counriesMarkup);
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(refs.sentinel);

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesFilterApi.query !== '') {
      fetchImages();
    }
  });
}
