const express = require('express');
const app = express();

app.get('/cse', (r, s) => s.send('<body style="background:lightblue"><h1>CSE Branch</h1></body>'));
app.get('/ece', (r, s) => s.send('<body style="background:lightgreen"><h1>ECE Branch</h1></body>'));
app.get('/mech', (r, s) => s.send('<body style="background:lightpink"><h1>MECH Branch</h1></body>'));

 app.listen(3002, () => console.log('✅ Server running at http://localhost:3002'));