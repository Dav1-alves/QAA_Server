const express = require("express");
const app = express();
const http = require('http')
const bodyParser = require("body-parser");
const connection = require("./database/database")
const Question = require("./database/question")
const Reply = require("./database/Reply");
const port = 3000

connection.authenticate().then(() => {console.log("Conexão efetuada com sucesso!")}).catch((ErrorMsg) => {console.log("Não foi possivel iniciar uma conexão ao banco de dados! Msg de erro: ". ErrorMsg)})

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    Question.findAll({ raw: true, order:[['id', 'DESC']] }).then(questions => { //ASC Crecente || DESC Decrecente
        res.render("home", {
            questions: questions
        })
    })
})
app.get("/admin", (req, res) => {
    res.render("Admin")
})
app.get("/question", (req, res) => {
    res.render("question.ejs")
})
app.post("/saveQ", (req, res) => {
    var title = req.body.title;
    var desc = req.body.desc;
    Question.create({
        title: title,
        desc: desc
    }).then(() => {
        res.redirect("/")
    })
})
app.post("/search", (req, res) => {
    var id = req.body.search
    Question.findOne({
        where: {id: id}
    }).then(question => {
        if(question != undefined) {
            Reply.findAll({
                where: {questionId: question.id}
            }).then(respostas => {
                res.render("reply", {
                    question: question,
                    reply: respostas
                });

            });
        }else {
            res.render("404")
        }
    })
})
app.get("/reply/:id", (req, res) => {
    var id = req.params.id;

    Question.findOne({
        where: {id: id}
    }).then(question => {
        if(question != undefined) { //Se achar
            Reply.findAll({
                where: {questionId: question.id},
                order: [['id', 'DESC']]
            }).then(reply => {
                res.render("reply", {
                    question: question,
                    reply: reply
                })
            })
        }else {
            res.send("Não achou")
        }
    })
})
app.post("/answers",(req, res) => {
    var body = req.body.body;
    var questionId = req.body.id;
    Reply.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/reply/"+ questionId);
    });
});
app.listen(port, () => {console.log("Server ligado com sucesso!")})