const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.post('/delete', async (req, res) => {
    const idToDelete = req.body.idToDelete;
  
    try {
      const result = await post.destroy({ where: { nome: idToDelete } });
      if (result === 1) {
        res.redirect('/consulta');
      } else {
        res.send(`Nome ${idToDelete} não localizado na base de dados.`);
      }
    } catch (error) {
      res.send(`Ocorreu um erro ao excluir o nome  ${idToDelete}.`);
    }
  });

app.get("/consulta", function(req, res){
    post.findAll().then(function(post){
        res.render("consulta", {post})
    }).catch(function(erro){
        console.log("Erro ao carregar dados do banco: " + erro)
    })
})

app.post("/cadastrar", function(req, res){
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.redirect("/consulta")
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados: " + erro)
    })
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})