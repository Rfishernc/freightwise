import $ from 'jquery';
import axios from 'axios';
import apiKeys from '../weather/apiKeys';

const getNews = () => new Promise((resolve, reject) => {
  axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKeys.news}`)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    });
});

const newsItemBuilder = (item) => {
  const htmlString = `<div class="media article">
    <img src="${item.urlToImage}" class="mr-3 newsImg" alt="article thumb">
    <div class="media-body">
    <a href=${item.url}><h5 class="mt-0">${item.title}</h5></a>
      ${item.description}
    </div>
  </div>`;

  return htmlString;
};

const newsBuilder = (newsData) => {
  const news = newsData.data.articles;
  const domArray = [];

  news.forEach((article) => {
    domArray.push(newsItemBuilder(article));
  });

  $('#news-container').append(domArray);
};

export default {
  getNews,
  newsItemBuilder,
  newsBuilder,
};
