const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url_artista_ep = 'mongodb://127.0.0.1:27017/artistas_eps';

mongoose.connect(url_artista_ep).then(() => {
    console.log("MongoDB conectado!");
}).catch((error) => {
    console.log("Erro ao conectar "  + error);
});