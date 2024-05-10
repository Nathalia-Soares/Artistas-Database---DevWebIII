const express= require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const artistas = require('./controller/ArtistasController');
const index = require('./controller/IndexController');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/', index);
app.use('/artistas', artistas);

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});