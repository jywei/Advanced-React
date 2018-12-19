const cookieParse = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use express middleware to handel cookies (JWT)
server.express.use(cookieParse());

// User express middleware to populate current_user
// docode the JWT so we can get the user ID on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the user ID onto req for future requests to access
    req.userId = userId;
  }
  next();
});

// Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // if they are not logged in, skip this
  if (!req.userId) return next(); 
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }'
  );
  req.user = user;
  next();
})


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