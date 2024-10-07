const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/utilizadores');

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                FormDataModel.create(req.body)
                    .then(log_reg_form => res.json(log_reg_form))
                    .catch(err => res.json(err));
            }
        });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    // Enviar sucesso junto com o ID e nome do usuário
                    res.json({ status: "Success", id: user._id, name: user.name });
                } else {
                    res.json({ status: "Wrong password" });
                }
            } else {
                res.json({ status: "No records found!" });
            }
        });
});

app.listen(3001, () => {
    console.log("Server listening on http://localhost:27017");
});
