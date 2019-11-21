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

const listSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true},
    item:[todoSchema]
});

const List = new mongoose.model('List',listSchema);
//Creating model on based of schema ... ie creating collection
const Todo = new mongoose.model('todo', todoSchema);
//end database area

//creating app
const app = express();


app.use(express.static('public')); //defining folder for static files
app.set('view engine','ejs'); //setting viewing engine as ejs for templeting and rendering

app.use(bodyParser.urlencoded({extended : true }));//so we can parse data from request body 

// default items

const welcome = new Todo({text:"Welcome to your todos "});
const delet = new Todo({text:" check box to delete the item"});
const addItem = new Todo({text:"Click (+) sign to add new todo"});





app.get('/', function(req, res){  
    var d= new Date();
    var options={
        weekday:'long',
        month:'long',
        day:'numeric'
    };
    today=d.toLocaleDateString('en-eu',options);
    
    Todo.find({},function (err,doc) {
        if (doc.length === 0){
            Todo.insertMany([welcome,delet,addItem],function(err){
                if (err){console.log(err);}
            });
            
        }
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
    res.redirect('/');
}
    // res.render('allday', {list:todoList});
});

app.get('/about',function(req,res){
    res.render('about');
})

app.get('/:customListName', function(req,res){
    const customLstName=req.params.customListName;
    List.findOne({name:customLstName},function(err,list){
        if (!list){
            const list = new List({name : customLstName, item:[welcome,delet,addItem]});
            list.save();
            console.log(list);
            res.redirect('/'+customLstName);
        } else {
            res.render('todo',{day:customLstName,list:list.item});
        }
    })
});

app.post('/:customListName',function(req,res){
    const customListName =req.params.customListName;
    let todo=req.body.todoItem;
    const item = new Todo({text:todo});
    List.findOne({name: customListName},function (err, list) {
        newItems=list.item.push(item);
        // console.log(newItaem);
        // list.item=newItems;
        list.save()
        res.redirect('/'+customListName);

    })
    
})


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


app.listen(3000, function(){
    console.log('Server started at 3000');
})



