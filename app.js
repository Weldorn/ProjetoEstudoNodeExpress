// Importacao do modulo do express para o node
const express = require("express");

// Importacao do modulo do body-parser para realizar o trabalho como json que sera enviado pelo cliente
const bodyParser = require("body-parser");

// Importacao do mongoose para realizar a persistencia com mongoDB
const mongoose = require("mongoose")

// vamos estabelecer a conexao com o banco de dados mongodb
const urldb = "mongodb+srv://weldorn:Alunos@123@clustercliente.2rosu.mongodb.net/banco?retryWrites=true&w=majority"
mongoose.connect(urldb, {useNewUrlParser:true,useUnifiedTopology:true})

// Criacao do esquema de dados da tabela. Campos da tabela
const tabela = new mongoose.Schema({
    nome:{type:String, required: true},
    email:{type: String, required: true},
    cpf:{type:String,required:true},
    telefone:String,
    idade:{type:Number,min:16,max:120},
    usuario:{type:String, unique:true},
    senha:String,
    datacadastro:{type:Date,default:Date.now}
})

// Construção de tablea com o comando model
const Cliente = mongoose.model('tbcliente',tabela)

// Utilizar o express na nossa aplicacao
const app = express();

app.use(bodyParser.json())

app.get("/",(req,res) => {
    Cliente.find((erro,dados)=> {
        if(erro){
            res.status(404).send({rs:`Erro ao tentar listar os cliente ${erro}`})
            return
        }
        res.status(200).send({rs:dados})
    })
})

app.post("/cadastro",(req,res) => {

    const dados = new Cliente(req.body)
    dados.save().then(()=> {
        res.status(201).send({rs:"Dados Cadastrados"})
    }).catch((erro)=>res.status(400).send({rs:`Erro ao tentar cadastrar ${erro}`}))


})

app.put("/atualizar/:id",(req,res) => {
    
    Cliente.findByIdAndUpdate(req.params.id,req.body,{new:true},(erro,dados)=> {
        if(erro) {
            res.status(400).send({rs:`Erro ao atualizar ${erro}`})
            return
        }
        res.status(200).send({rs:dados})
    })
})

app.delete("/apagar/:id",(req,res)=> {
    
    Cliente.findByIdAndDelete(req.params.id,(erro,dados)=> {
        if(erro) {
            res.status(400).send({rs:`Erro ao tentar apagar ${erro}`})
            return
        }
        res.status(204).send({rs:"apagado"})
    })
})

app.listen(3000);

console.log("Servidor online... Para finalizar utilize CTRL+C");

//vamos adicionar um tratamento ao erro de requisicao inexistente, ou seja o erro 404
app.use((req,res) => {
    res.type("application/json");
    res.status(404).send({erro:'404 - Pagina nao encontrada'});
    
})