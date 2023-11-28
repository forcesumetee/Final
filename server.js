const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); // เพิ่ม line นี้เพื่อให้ใช้ path module

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public'))); // เพิ่ม line นี้เพื่อให้ Express รู้จักไดเรกทอรี public

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projectfb'  // แก้ไขชื่อฐานข้อมูลเป็น "projectfb"
});


db.connect((err) => {
  if (err) {
    console.error('ไม่สามารถเชื่อมต่อกับ MySQL: ' + err.stack);
    return;
  }
  console.log('เชื่อมต่อกับ MySQL สำเร็จ');
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female', 'not_specified') NOT NULL
);
`;

db.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('ไม่สามารถสร้างตาราง users: ' + err.message);
  } else {
    console.log('ตาราง users ถูกสร้างหรือมีอยู่แล้ว');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Menu.html')); 
});


app.post('/register', (req, res) => {
  const { fullName, username, email, phoneNumber, password, gender } = req.body;

  const insertUserQuery = `
    INSERT INTO users (full_name, username, email, phone_number, password, gender)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(
    insertUserQuery,
    [fullName, username, email, phoneNumber, password, gender],
    (err, result) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการลงทะเบียน: ' + err.message);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
      } else {
        console.log('ลงทะเบียนสำเร็จ');
        res.status(200).json({ message: 'ลงทะเบียนสำเร็จ' });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
});
