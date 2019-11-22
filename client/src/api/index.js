import axios from 'axios';

export const feedSearch = async (searchQuery) => {
  if (Array.isArray(searchQuery)) {
    return new Promise((resolve, reject) => {
      axios.all(searchQuery.map((url) => axios.post('/api/feed', { url: url })))
        .then(axios.spread(function (...res) {
          resolve(res);
        }));
    })
  } else {
    return new Promise((resolve, reject) => {
      axios.post(`/api/feed`, {
        url: searchQuery
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
};