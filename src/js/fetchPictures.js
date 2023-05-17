const axios = require('axios').default;

export default function fetchPictures(name) {
//   return fetch(
//     `https://pixabay.com/api/?key=36483572-589c8e3037882858d868a0c70&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=4`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
    const url = `https://pixabay.com/api/?key=36483572-589c8e3037882858d868a0c70&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=4`;
const axios = require('axios');
    return axios.get(url)
}
