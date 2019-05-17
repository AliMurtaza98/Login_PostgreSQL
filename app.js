let express = require('express');
var bodyParser = require('body-parser');
let app = express();
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.set('view engine', 'ejs');
//Array de objetos
var login = [{name : 'Ali', pass : "1234"},
                {name : 'Roger', pass : "1234"},
               {name : 'David', pass : "1234"}];
//Conexion PostgreSQL (https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://dqvxhzsqxsryzm:8d7c8b17367ef4ecf6ca52445ec99fe6f8bc6a3e67dc52f3fff97e59424a5db4@ec2-54-163-230-199.compute-1.amazonaws.com:5432/d5ia05gep63dm8",
  //connectionString: process.env.DATABASE_URL,
  ssl: true
});
// Sin esto, da error de No Access Controll Allow Origin
// -- Enlace --> https://stackoverflow.com/questions/7067966/how-to-allow-cors
var cors = require('cors')
app.use(cors())

//Llamamos al form que es el html desde la barra que es el localhost
app.get('/', function(req, res) {
  res.render("form");
});

//Hacemos un post para comparar los valores introducidos con los valores que tenemos
app.post('/', urlencodedParser,function (req,res){
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
    try {
      const client = await pool.connect()
      //HAY 2 FORMAS DE HACERLO
      /*
      * Podriamos hacer SELECT * FROM students; y luego meterlo en array y recorrerlo comprobando si hay algun password y usuario que igualen, como es mas largo, esto es mas corto.
      */
      const result = await client.query("SELECT * FROM students WHERE username='"+req.params.nombre+"'AND password='"+req.params.password+"';");
      const results = result.rows;
      if(results[0] != null) {
        let usuarioLoged = {name:req.params.nombre,password:req.params.password};
        //res.render('loged',{usuario:JSON.stringify(usuarioLoged)});
        var status={"status":"OK"};
        res.send(JSON.stringify(status));
        //return;
      }else{
        var status={"status":"ERROR"};
        res.send(JSON.stringify(status));
      }
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
var port = process.env.PORT||5000;
app.listen(port,()=> console.log('Escuchando al puerto; '+port))
