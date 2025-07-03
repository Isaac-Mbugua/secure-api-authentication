const getProfile = (req, res) => {
  res.json({
    name: "Isaac Mbugua",
    email: "mbuguaisaac@gmail.com",
  });
};

module.exports = {getProfile}
