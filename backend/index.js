const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require ('./models/FormData');


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://mongo:mongo@cluster0.l1qg8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/utilizadores');

app.post('/register', (req, res)=>{
    // To post / insert data into database

    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            res.json("Already registered")
        }
        else{
            FormDataModel.create(req.body)
            .then(log_reg_form => res.json(log_reg_form))
            .catch(err => res.json(err))
        }
    })
    
})

app.post('/login', (req, res)=>{
    // To find record from the database
    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            // If user found then these 2 cases
            if(user.password === password) {
                res.json("Success");
            }
            else{
                res.json("Wrong password");
            }
        }
        // If user not found then 
        else{
            res.json("No records found! ");
        }
    })
})

app.get('/userDetails', (req, res) => {
    const email = req.query.email; // Obtendo o email dos parâmetros de consulta

    // Buscando o usuário no banco de dados usando o email
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // Se o usuário for encontrado, retorne os dados do usuário
                res.json({
                    email: user.email,
                    name: user.name, // Adicione o campo name se existir no modelo
                    // Adicione outros detalhes que você quiser retornar
                });
            } else {
                // Se o usuário não for encontrado, retorne 404
                res.status(404).send('User not found');
            }
        })
        .catch(err => {
            // Em caso de erro ao acessar o banco de dados
            console.error(err);
            res.status(500).send('Internal server error');
        });
});

app.listen(3001, () => {
    console.log("Server listining on http://127.0.0.1:3001");

});