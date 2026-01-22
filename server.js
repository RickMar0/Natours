const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app running on port ${port}\nhttp://192.168.1.100:${port}\n\n`);
});

// http://192.168.1.100:3000
