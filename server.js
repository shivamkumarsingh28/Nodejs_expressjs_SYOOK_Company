// initialize express Js
const express = require("express");
const fs = require('fs');
const crypto = require("crypto");

const app = express();

const algorithm = 'aes-256-cbc';

// private key
const key = "saeeam-tech-programming-computer";
// must be of 32 characters

// app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res){
    fs.readFile(__dirname + "/" + "database.json", 'utf8', function(err, data){
        console.log(data);
        res.end(data); // you can also use res.send()
    });
  });

app.get('/datasend', (req,res) => {

    res.render('form');
});

function savedata(encryptdata){
    id = Math.random();
    fs.readFile(__dirname + "/" + "database.json", 'utf8', function(err, data){
      var myobj = JSON.parse(data);
        
    myobj['data'][0]["secret_key"] = encryptdata;

    var data2 =JSON.stringify(myobj);
      
    fs.writeFile("database.json", data2, (err) => {
        // Error checking
        if (err) throw err;
        return "Data Input Save Success"
    });
  
  });}

app.post('/reqdata', (req,res) => {
    let inputmsg = req.body.msg;
    const iv = crypto.randomBytes(16);
    // encrypt the string using encryption algorithm, private key and initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(inputmsg, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    const save=savedata(encryptedData);
    // console.log(save);
    res.send(encryptedData);
    
});



// create HTTP server
const http = require("http").createServer(app);


http.listen(process.env.PORT || 3000, function(){
    console.log("server start")
});
