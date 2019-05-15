let express = require('express');
var bodyParser = require('body-parser');
let app = express();
//Array de objetos
var login = [{name : 'Ali', pass : "1234"},
                {name : 'Roger', pass : "1234"},
               {name : 'David', pass : "1234"}];
//Conexion PostgreSQL (https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://afmybgxecplsgr:a6b778bda504e59ec3240800444e47f5cedc423f805fbdfd4fb288009c490f1c@ec2-54-221-198-156.compute-1.amazonaws.com:5432/d61mnrfhhat2na",
  ssl: true
});

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

//PostgreSQL (ht  tps://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
app.get('/db/api/login/:nombre/:password', async (req, res) => {
  var json={};
    try {
      const client = await pool.connect()
      //const result = await client.query("select * from students where username='"+nombre+"' and password='"+password+"'");
      const result = await client.query("SELECT * FROM students WHERE name='"+username+"' AND password='"+password+"'");
      const results = result.rows;
      if(result[0].rows>0){
          json.status="OK";
      }
      res.send(json);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
var port = process.env.PORT||5000;
app.listen(port,()=> console.log('Escuchando al puerto; '+port))
