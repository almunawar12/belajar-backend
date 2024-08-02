// const app = require('./app');
const server = require('./app');

const port = process.env.PORT || 4500;
// app.listen(port, () => {
//   console.log(`Listening: http://localhost:${port}`);
// });
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
