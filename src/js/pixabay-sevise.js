const API_KEY = '20426626-1108d2b53bdb59840c18c2bd8';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesFilterApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const searchParams = new URLSearchParams({
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    const url = `${BASE_URL}?key=${API_KEY}${searchParams}`;

    return fetch(url)
      .then(response => {
        const resp = response.json();
        return resp;
      })
      .then(this.incrementPage());
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
