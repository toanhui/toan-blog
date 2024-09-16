const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { engine} = require('express-handlebars')
const app = express()
const port = 3000
const con = require('./mysql.js');
const route = require('./routes');
const bodyParser = require('body-parser');

//db

app.use(express.static(path.join(__dirname, 'public')))
app.use("/img", express.static(path.join(__dirname, "/public/img")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));
app.use("/font", express.static(path.join(__dirname, "/public/font")));

// mogran
app.use(morgan("combined"))

// template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
console.log(__dirname);

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

app.set('views', path.join(__dirname,'resources/views'));

app.use(express.urlencoded({
    extended : true,
}));
app.use(express.json());

// sql


app.use(bodyParser.urlencoded({ extended: true }));

// Hiển thị form với dữ liệu từ cơ sở dữ liệu
app.get('/myshop', (req, res) => {
  const id = req.query.id;
  console.log({id});
  con.query('SELECT * FROM be.qly', (err, results) => {
    console.log({err, results});
    const data = {
      items: results
    }
    if (err) throw err;
    
    res.render('myshop', data);
  });
});



app.get('/add', (req, res) => {
  const id = req.query.id;
  console.log({id});
  con.query('SELECT * FROM be.qly', (err, results) => {
    console.log({err, results});
    const data = {
      items: results
    }
    if (err) throw err;
    
    res.render('add', data);
  });
});

















// aaaaa
app.get('/data', (req, res) => {
  var sql = "SELECT * FROM qly";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});
app.post('/update', async (req, res) => {
  const data = req.body;
  const sql = `INSERT INTO qly (id, name, title, price, sale, soluong, description, img1, img2) VALUES (${data.id}, "${data.name}", "${data.title}", "${data.price}","${data.sale}","${data.soluong}","${data.description}","${data.img1}","${data.img2}");`;
  console.log(sql);
  console.log("==============================",req.body);
  const resp = await con.execute(sql);
  res.send('OK');

});
app.post('/fix', async(req, res) =>{
  const data = req.body;
  const sql = `UPDATE qly SET name='${data.name}', title='${data.title}', img1='${data.img1}', img2='${data.img2}', price='${data.price}', sale='${data.sale}', soluong='${data.soluong}', description='${data.description}' WHERE id=${data.id}`;
  console.log(sql);
  const resp = await con.execute(sql);
  res.send('OK');
});





// register


app.get('/register', (req, res) => {
  const id = req.query.id;
  console.log({id});
  con.query('SELECT * FROM be.user', (err, results) => {
    console.log({err, results});
    const data = {
      items: results
    }
    if (err) throw err;
    
    res.render('register', data);
  });
});


app.get('/dataregister', (req, res) => {
  var sql = "SELECT * FROM users";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/updateregister', async (req, res) => {
    const data = req.body;

    console.log("========================= data", data);
    const check = `SELECT count(*) as count FROM user WHERE username = "${data.name}" or email = "${data.email}";`;
    con.query(check, async function(err, results) {
      if (err) throw err;
      console.log( "========================= results",results);
      console.log("========================= results[0]", results[0].count);
      const ptu = results[0];
      console.log("========================= ptu", ptu.count);


      if (results[0].count >= 1) {

        console.log('da bi loi');
        const err = {
          message: 'Username or email is already in use'
        }
        return res.send(err, 400)
      }
      else {
        const sql = `INSERT INTO user (username, password, email) VALUES ("${data.name}", "${data.password}", "${data.email}");`;
        console.log(sql);
        console.log("==============================",req.body);
        const resp = await con.execute(sql);
        console.log("==============================",resp);
        res.send({message: 'Created successfully'}, 200);
      }
    });



});



app.post('/fixregister', async(req, res) =>{
  const data = req.body;
  const sql = `UPDATE qly SET username='${data.username}', email='${data.email}', password='${data.password}', created_at='${data.created_at}' WHERE id=${data.id}`;
  console.log(sql);
  const resp = await con.execute(sql);
  res.send('OK');
});







// login

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
const { username, password } = req.body;
const sql = `SELECT * FROM user WHERE username = ? AND password = ?`;
con.query(sql, [username, password], (err, results) => {
  if (err) {
    console.error('Error during login:', err);
    return res.status(500).send('Internal server error');
  }
  if (results.length === 0) {
    return res.status(401).send('Invalid username or password');
  }
  res.send('Login successful!');
});
});




// myshopfull
app.get('/shopfull', (req, res) => {
  const id = req.query.id;
  console.log('ID from query:', id);
  if (!id) {
    return res.status(400).send('ID is required');
  }
  con.query('SELECT * FROM qly WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database query failed.');
    }

    if (results.length > 0) {
      const data = {
        items: results[0]
      };
      console.log(data);
      res.render('shopfull', data);
    } else {
      res.status(404).send('Item not found');
    }
  });
});


// blog

app.get('/blog', (req, res) => {
  res.render('blog');
});
































































// rotuer init 
route(app);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})