let express = require('express');
var bodyParser = require('body-parser');
let app = express();
//Array de objetos
var login = [{name : 'Ali', pass : "1234"},
                {name : 'Roger', pass : "1234"},
               {name : 'David', pass : "1234"}];
//Conexion PostgreSQL (https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
/*const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});*/

app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

//Llamamos al form que es el html desde la barra que es el localhost
app.get('/', function(req, res) {
  res.render("form");
});

//Hacemos un post para comparar los valores introducidos con los valores que tenemos
app.post('/', function (req,res){
  for (var i = 0; i < login.length; i++) {
    if(login[i]['name'] == req.body.nombre && login[i]['pass'] == req.body.password){
      let usuarioLoged = {name:req.body.nombre,pass:req.body.password};
      res.render('loged',{usuario:JSON.stringify(usuarioLoged)});
      return;
    }
  }
  res.send("Error: Usuario incorrecto..");
});

//No llamamos al form, sino directamente desde la url le pasamos los valores
app.get('/api/login/:nombre/:password', function (req,res){
  for (var i = 0; i < login.length; i++) {
    if(login[i]['name'] == req.params.nombre && login[i]['pass'] == req.params.password){
      let usuarioLoged = {name:req.params.nombre,pass:req.params.password};
      res.render('loged',{usuario:JSON.stringify(usuarioLoged)});
      return;
    }
  }
  res.send("Error 404 : User doesn't exist !!");
});

//PostgreSQL (https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
/*app.get('/db/api/login/:nombre/:password', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM students WHERE username='"+nombre+"' AND password='"+password+"'");;
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  */
var port = process.env.PORT||5000;
app.listen(port,()=> console.log('Escuchando al puerto; '+port))
