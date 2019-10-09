import axios from 'axios';
import apiKeys from '../weather/apiKeys';

const getNews = test => new Promise((resolve, reject) => {
  axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKeys.news}`)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      test.setError(err);
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

  // eslint-disable-next-line quotes
  domArray.push(`<h3 class='newsTitle'>Your top news stories</h3>`);

  news.forEach((article) => {
    domArray.push(newsItemBuilder(article));
  });

  return domArray;
};

export default {
  getNews,
  newsItemBuilder,
  newsBuilder,
};
