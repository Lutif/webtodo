const express= require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose =require ('mongoose');

//database area
// Connection URL and creating db if doesnt exist
var db = mongoose.connect('mongodb://localhost:27017/tododb', {useNewUrlParser: true, useUnifiedTopology: true } );

//Creating Schema
const todoSchema = new mongoose.Schema({
    text: String,
});


//Creating model on based of schema ... ie creating collection
const Todo = new mongoose.model('todo', todoSchema);
//end database area

//creating app
const app = express();


app.use(express.static('public')); //defining folder for static files
app.set('view engine','ejs'); //setting viewing engine as ejs for templeting and rendering

app.use(bodyParser.urlencoded({extended : true }));//so we can parse data from request body 


app.get('/', function(req, res){  
    var d= new Date();
    var options={
        weekday:'long',
        month:'long',
        day:'numeric'
    };
    today=d.toLocaleDateString('en-eu',options);
    
    Todo.find({},function (err,doc) {
        
        res.render('todo',{day:today, list:doc});
    })


});

app.post('/', function (req, res) { 
    todo=req.body.todoItem;
    if (req.body.button === 'Work'){
        console.log(req.body);
        res.redirect('/work');
        workTodo.push(todo);}
        // console.log(req.body);}
    
    else {
    
    const item = new Todo({text:todo});
    item.save()
    res.redirect('/');}
    // res.render('allday', {list:todoList});
});

app.get('/:listName', function(req,res){
    name=req.params.listName;
    const newList = new mongoose.model(name,todoSchema);
    console.log(newList);
        
    res.render('todo',{day:name,list: name});
});


app.post('/delete',function(req,res){
    console.log("deleting "+req.body.id);
    let id=req.body.id;
    Todo.deleteOne({_id : id},function(err){
        if (err){
            console.log(err);
        }
    })
    res.redirect('/');
});

app.get('/about',function(req,res){
    res.render('about');
})

app.listen(3000, function(){
    console.log('Server started at 3000');
})



