const cookieParse = require('cookie-parser');

require('dotenv').config({ path: '.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use express middleware to handel cookies (JWT)
server.express.use(cookieParse());
// TODO User express middleware to populate current_user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now runnign on port http://localhost:${deets.port}`)
  }
);