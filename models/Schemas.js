require('./db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Artistas = new Schema({
    imgUrl: {
        type: String,
        required: true
    },

    nome: {
        type: String,
        required: true
    },

    genero: {
        type: String,
        required: true
    },

    eps: [{
        imgUrl: {
            type: String,
            required: false
        },

        nome: {
            type: String,
            required: false
        },
    
        ano_lancamento: {
            type: Number,
            required: false
        },
    
        gravadora: {
            type: String,
            required: false
        },
    
        lista_musicas: {
            type: [String],
            required: false
        }
    }],
});

mongoose.model('artistas', Artistas);