const fs = require('fs');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.get('/api/stocks', (req, res) => {
    connection.query(
        "SELECT * FROM STOCK",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.get('/api/stocks/myattention', (req, res) => {
    connection.query(
        "SELECT * FROM STOCK WHERE myattention = 1",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.patch('/api/stocks/:codekey', (req, res) => {
    let sql = 'UPDATE STOCK SET myattention = 1 WHERE codekey = ?';
    let params = [req.params.codekey];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.delete('/api/stocks/:codekey', (req, res) => {
    let sql = 'UPDATE STOCK SET myattention = 0 WHERE codekey = ?';
    let params = [req.params.codekey];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.listen(port, () => console.log(`Listening on port ${port}`));