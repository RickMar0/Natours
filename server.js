const app = require("./app");

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}\nhttp://192.168.1.100:3000\n\n`);
});

// http://192.168.1.100:3000
