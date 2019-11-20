const express= require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

let todoList=[];
let workTodo=[];


const app = express();

app.use(express.static('public'));
app.set('view engine','ejs'); //setting viewing engine as ejs for templeting and rendering

app.use(bodyParser.urlencoded({extended : true }));
//so we can parse data from request body 


app.get('/', function(req, res){
    var d= new Date();
    var options={
        weekday:'long',
        month:'long',
        day:'numeric'
    };
    today=d.toLocaleDateString('en-eu',options);
    res.render('todo',{day:today, list:todoList});


});

app.post('/', function (req, res) {
    todo=req.body.todoItem;
    if (req.body.button === 'Work'){
        console.log(req.body);
        res.redirect('/work');
        workTodo.push(todo);}
        // console.log(req.body);}
    
    else {
    
    todoList.push(todo);
    res.redirect('/');}
    // res.render('allday', {list:todoList});
});

app.get('/work', function(req,res){
    res.render('todo',{day:'Work',list:workTodo});
});

// app.post('/work', function (req,res) {
    
//     item=req.body.todoItem;
//     workTodo.push(item);
//     console.log('back to work');
//     res.redirect('/work');
// })

app.get('/about',function(req,res){
    res.render('about');
})


app.listen(3000, function(){
    console.log('Server started at 3000');
})



