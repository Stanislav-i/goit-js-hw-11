import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkUp from './js/markUp.js';

const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '36483572-589c8e3037882858d868a0c70';

let page = 1;
let userQuery = '';
let lbInstance;

const refs = {
  formEl: document.getElementById('search-form'),
  inputEl: document.getElementById('js-input'),
  submitEl: document.getElementById('js-submit'),
  loadBtn: document.getElementById('js-load-btn'),
  galleryEl: document.getElementById('js-gallery'),
};

export default refs;

refs.formEl.addEventListener('submit', onSubmit);
refs.loadBtn.addEventListener('click', loadMorePictures);

function onSubmit(e) {
  e.preventDefault();
  clearMarkUp();
  userQuery = refs.inputEl.value.trim();

  if (userQuery !== '') {
    fetchPictures()
      .then(responce => {
        if (responce.data.hits.length === 0) {
          refs.loadBtn.classList.add('is-hidden');
          return Notiflix.Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (responce.data.hits.length < 40) {
          refs.loadBtn.classList.add('is-hidden');
          createMarkUp(responce.data.hits);
          createLightbox();
          const totalHits = responce.data.totalHits;
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
          return;
        } else createMarkUp(responce.data.hits);
        createLightbox();
        const totalHits = responce.data.totalHits;
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        page += 1;
        refs.loadBtn.classList.remove('is-hidden');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(clearInputField());
  } else {
    refs.loadBtn.classList.add('is-hidden');
    clearInputField();
    Notiflix.Notify.info('Search with no info is not available :)');
  }
}

async function fetchPictures() {
  try {
    const response = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${userQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return response;
  } catch (error) {
    refs.loadBtn.classList.add('is-hidden');
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  // return axios
  // .get(
  //   `${BASE_URL}/?key=${API_KEY}&q=${userQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  // )
  //   .catch(error => {
  //     refs.loadBtn.classList.add('is-hidden');
  //     return Notiflix.Notify.info(
  //       "We're sorry, but you've reached the end of search results."
  //     );
  //   });
}

function clearInputField() {
  refs.inputEl.value = '';
}

// function createMarkUp(arr) {
//   const markUpPictures = arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `<div class="photo-card">
//       <a class="gallery__link" href="${largeImageURL}">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" height=300px width=100% />
//   </a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//       <b>${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//       <b>${views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//       <b>${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//       <b>${downloads}</b>
//     </p>
//   </div>
// </div>`
//     )
//     .join('');

//   refs.galleryEl.insertAdjacentHTML('beforeend', markUpPictures);
// }

function clearMarkUp() {
  refs.galleryEl.innerHTML = '';
  page = 1;
}

function loadMorePictures() {
  fetchPictures().then(responce => {
    if (responce.data.hits.length === 0) {
      refs.loadBtn.classList.add('is-hidden');
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (responce.data.hits.length < 40) {
      createMarkUp(responce.data.hits);
      lbInstance.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      refs.loadBtn.classList.add('is-hidden');
    } else {
      createMarkUp(responce.data.hits);
      lbInstance.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  });

  page += 1;
}

function createLightbox() {
  lbInstance = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}


