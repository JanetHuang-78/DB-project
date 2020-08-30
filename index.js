const express = require('express');
const app = express();
const cors = require('cors')
const bodyparser = require('body-parser')
//const engine = require('ejs-locals')
const ejslayouts = require('express-ejs-layouts')

var knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'test'
    }
  });

  knex.schema
  .createTable('users', table => {
    table.increments('id');
    table.string('user_name');
  })

//   knex.select('*').from ('recipes')
//   .then(data=>{console.log(data)});

app.use(express.static('public')) //use the css file in the public folder
app.use(express.static(__dirname + 'public'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))


app.use(cors());
app.use(ejslayouts)

//when declare engine = require('ejs-locals'),have to decalre app.engine here
//app.engine('ejs',engine) 

//no matter what kind of ejs template language is used,
//below two app.set are necessary
app.set('views','./views')
app.set('view engine','ejs')


var database = [
    {
        id : 1,
        name:'John',
        job : 'accounting',
        email : 'john@gmail.com'
     },
    {   id : 2,
        name:'Sally',
        job : 'fashion',
        email : 'sally@gmail.com'

    }
]

app.get('/picture',(req,res)=>{
    res.sendFile(__dirname+'/public/picture.html')
})

app.get('/',(req,res)=>{
    res.render('index',{layout:'./frontpage', title:'FrontPage'})
})

// app.post('/signin',(req,res)=>{
//     for(let i=0; i<database.length; i++){
//         if(req.body.name === database[i].name && req.body.email === database[i].email){
//             res.send('success')
//         }
//         else{res.status(400).send('login fail.')}
//     }
// })

app.get('/register',(req,res)=>{
    res.render('register',{layout:'./sidebar',title:'Insert New Member',
    sidebar:'this is the function to add new member'})
})

app.post('/register',(req,res)=>{

    const {id, name, desc} = req.body;
    
    knex('recipes')
    .returning('*')
    .insert({
        id:id,
        name:name,
        directions:desc
    })
    .then((response)=>res.json(response))
    .catch((err)=>res.status(400).json(err))

    //res.redirect('register')
})

app.get('/searchData',(req,res)=>{
    res.render('searchId',{title:'Search Member', key: 'the value:',layout:'./sidebar',
    sidebar:'this is the function to search member'})
})

app.post('/searchId',(req,res)=>{
    const {column,searchText} = req.body;
    console.log(req.body);
    //let found = false;
    // for(let i=0; i<database.length; i++){    
    //     if(id == database[i].id ){
    //         found = true;
    //         console.log(database[i].id, found);
    //         return res.send(database[i])
    //     }    
    // }
    //if (!found){res.send('Login fail')}
    
    knex('recipes')
    .where(column, '=', searchText)
    .returning('*')
    .then(data=>{res.json(data)})
       
})

app.get('/updateData',(req,res)=>{
    res.render('updateId',{title:"Update Member",layout:'./sidebar',
    sidebar:'this is the function to update member infomation'})
})

app.post('/updateId',(req,res)=>{
    const {id, name, desc} = req.body;

    knex('recipes')
    .where('id', '=', id)
    .update({
    name: name,
    directions: desc
  })
  .returning('*')
  .then((data)=>{res.json(data)})
})



app.listen(3000)