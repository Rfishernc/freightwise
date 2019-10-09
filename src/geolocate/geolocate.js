
const geolocate = () => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-undef
   navigator.geolocation.getCurrentPosition((position) => {
    resolve(position);
  });
});

export default {
  geolocate,
};
