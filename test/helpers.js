function handlePromise (promiseFunc) {
  return promiseFunc
    .then(payload => {
      return { success: true, payload };
    })
    .catch(err => {
      return { success: false, err };
    });
}

module.exports = {
  handlePromise
};
