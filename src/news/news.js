import axios from 'axios';
import apiKeys from '../weather/apiKeys';

/* This method uses an axios call to the news api and resolves the response from the api
*/

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

/* This method takes a single news article item from the array returned from the api and builds out a dom string for that article.
*/

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

/* This method takes the response from the news api and uses the newsItemBuilder method to build an array of DOM strings to pass along
   to the setResults method for rendering.
*/

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
