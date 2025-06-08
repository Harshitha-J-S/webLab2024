const express = require('express');
const app = express();
let visits = 0;

const logger = (req,res,next) => {
  console.log(`Visited: ${req.method} ${req.url}`);
  next();
};
const countVisits = (req,res,next) => {
  visits++;
  res.setHeader('X-Visits', visits);
  next();
};

app.use(logger);
app.use(countVisits);

app.get('/', (req,res) => res.send(`Welcome! Visits so far: ${visits}`));

app.listen(3003, () => console.log('✅ Server running at http://localhost:3003'));
