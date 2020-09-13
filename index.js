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

//   knex.schema
//   .createTable('users', table => {
//     table.increments('id');
//     table.string('user_name');
//   })

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



app.get('/',(req,res)=>{
    res.render('index',{layout:'./frontpage', title:'FrontPage'})
})


app.get('/register',(req,res)=>{
    res.render('register',{layout:'./sidebar',title:'Insert New Member',
    sidebar:'this is the function to add new member'})
})

app.post('/register',(req,res)=>{

    const {name, department,email} = req.body;
    
    knex('member')
    .returning('*')
    .insert({
        name:name.charAt(0).toUpperCase()+name.slice(1),
        department:department,
        email:email
    })
    .then((response)=>res.json(response))
    .catch((err)=>res.status(400).json(err))
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
    let search = '';
    if (column =='id'){
        search = searchText;
    }else{
        search = searchText.charAt(0).toUpperCase()+searchText.slice(1);
    }
    
    knex('member')
    .where(column, '=', search )
    .returning('*')
    .then(data=>{
        if (data == ''){
            res.json('No record in DataBase')
        }else{
        res.json(data)
        }
    
    }
    )

       
})

app.get('/updateData',(req,res)=>{
    res.render('updateId',{title:"Update Member",layout:'./sidebar',
    sidebar:'this is the function to update member infomation'})
})

app.post('/updateId',(req,res)=>{
    const {id, name, department,email} = req.body;

    let nameCapital = name.charAt(0).toUpperCase() + name.slice(1);

    knex('member')
    .where('id', '=', id)
    .update({    
    name: nameCapital,
    department: department,
    email:email
  })
  .returning('*')
  .then((data)=>{res.json(data)})
})

app.get('/current',(req,res)=>{
    res.render('current',{title:"All Member",layout:'./sidebar',
    sidebar:'Click the button to show all the members.'})
    
    
})

app.post('/current',(req,res)=>{
    knex.select('*').from ('member')
    .orderBy('id')
    //.then(data=>{console.log(data)})
    .then((data)=>{res.json(data)})
    
})

app.get('/delete',(req,res)=>{
    res.render('deleteData',{title:"Delete Member",layout:'./sidebar',
    sidebar:'this is the function to delete member'})
})

app.post('/deleteData',(req,res)=>{
    const{column, searchText} = req.body
    let search = ''

    if (column =='id'){
        search = searchText;
    }else{
        search = searchText.charAt(0).toUpperCase()+searchText.slice(1)
    }
    
    knex('member')
    .where(column,'=',search)
    .del()
    .returning('*')
    .then(data=>{res.json(data)})

})



app.listen(5000)