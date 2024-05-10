const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

require('../models/Schemas');
const Artistas = mongoose.model('artistas');

// Exibir artistas
router.get('/artistas', (req, res) => {
    Artistas.find().lean().then((artistas) => {
        res.render("admin/artistas/artista", { artistas: artistas });
    });
});

// Exibir EP do artista
router.get('/artistas/:artistaId/eps/:epId', (req, res) => {
    Artistas.findById(req.params.artistaId).then((artista) => {
        if (!artista) {
            return res.status(404).send('Artista não encontrado');
        }
        const ep = artista.eps.id(req.params.epId);
        if (!ep) {
            return res.status(404).send('EP não encontrado');
        }
        res.render('admin/eps/ep', {
            artista_id: artista._id,
            artista_nome: artista.nome,
            _id: ep._id,
            nome: ep.nome,
            imgUrl: ep.imgUrl,
            ano_lancamento: ep.ano_lancamento,
            gravadora: ep.gravadora,
            lista_musicas: ep.lista_musicas
        });
    }).catch((err) => {
        res.status(500).send('Ocorreu um erro ao buscar o artista e o EP');
    });
});

// Direcionar para a página "Criar artista"
router.get('/adicionar', (req, res) => {
    res.render("admin/artistas/adicionar_artista");
});

// Upload de imagens
const storageArtistas = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadArtistas = multer({ storage: storageArtistas });

// Criar artista
router.post('/novo_artista', uploadArtistas.single('imagem'), (req, res) => {
    var artista = new Artistas();
    artista.imgUrl = '/img/uploads/' + req.file.filename;
    artista.nome = req.body.nome;
    artista.genero = req.body.genero;
    artista.eps = [];

    if (Array.isArray(req.body.eps)) {
        req.body.eps.forEach((ep) => {
            artista.eps.push({
                nome: ep.nome,
                imgUrl: ep.imgUrl,
                ano_lancamento: ep.ano_lancamento,
                gravadora: ep.gravadora,
                lista_musicas: ep.lista_musicas
            });
        });
    } else {
        artista.eps.push({
            nome: req.body.eps.nome,
            imgUrl: req.body.eps.imgUrl,
            ano_lancamento: req.body.eps.ano_lancamento,
            gravadora: req.body.eps.gravadora,
            lista_musicas: req.body.eps.lista_musicas
        });
    }
    console.log(artista)
    artista.save().then(() => {
        res.redirect('/artistas/artistas');
    });
});

// Encontrar artista por ID
router.get('/editar_artista/:id', (req, res) => {
    Artistas.findOne({ _id: req.params.id })
        .lean()
        .then((artistas) => {
            res.render("admin/artistas/editar_artista", { artista: artistas });
        });
});

// Editar artista
function converterEpsParaObjeto(eps) {
    const epsArray = [];
    for (let key in eps) {
        if (key.startsWith('eps[')) {
            const index = key.charAt(4);
            if (!epsArray[index]) {
                epsArray[index] = {};
            }
            epsArray[index].imgUrl = eps[key];
            epsArray[index].nome = eps[key];
            epsArray[index].ano_lancamento = eps[key];
            epsArray[index].gravadora = eps[key];
            epsArray[index].lista_musicas = eps[key];
        }
    }
    return epsArray;
}

router.post('/editar_artista/:id', (req, res) => {
    const { nome, genero, ...eps } = req.body;
    const epsArray = converterEpsParaObjeto(eps);
    Artistas.updateOne(
        { _id: req.params.id },
        { $set: { nome, genero, eps: epsArray } }
    )
        .then(() => res.redirect('/artistas/artistas')) 
        .catch((error) => res.send("Houve um erro: " + error));
});

// Encontrar EP por ID e atualizar
router.get('/artistas/:artistaId/eps/editar_ep/:epId', (req, res) => {
    Artistas.findById(req.params.artistaId).then((artista) => {
        const ep = artista.eps.id(req.params.epId);
        console.log('Artista ID:', artista._id); 
        console.log('EP ID:', ep._id); 
        if (!ep) {
            return res.status(404).send('EP não encontrado');
        }
        res.render('admin/eps/editar_ep', { artista: artista, ep: ep });
    }).catch((err) => {
        res.status(500).send('Ocorreu um erro ao tentar encontrar o EP');
    });
});

router.post('/artistas/:artistaId/eps/editar_ep/:epId/salvar',  uploadArtistas.single('imagem'), (req, res) => {
    const { nome, ano_lancamento, gravadora, lista_musicas } = req.body;
    Artistas.findOneAndUpdate(
        { _id: req.params.artistaId, 'eps._id': req.params.epId },
        { $set: { 
            'eps.$.imgUrl': '/img/uploads/' + req.file.filename, 
            'eps.$.nome': nome, 
            'eps.$.ano_lancamento': ano_lancamento, 
            'eps.$.gravadora': gravadora, 
            'eps.$.lista_musicas': lista_musicas,
        } }
    )
        .then(() => {
            res.redirect(`/artistas/${req.params.artistaId}/eps/editar_ep/${req.params.epId}`);
        })
        .catch((error) => res.send("Houve um erro: " + error));
});

// Deletar artista
router.get('/deletar_artista/:id', (req, res) => {
    Artistas.deleteOne({ _id: req.params.id }).then(() => {
        res.redirect('/artistas/artistas');
    });
});

// Deletar EP
router.get('/artistas/:artistaId/eps/deletar_ep/:epId', (req, res) => {
    Artistas.findById(req.params.artistaId).then((artista) => {
        if (!artista) {
            return res.status(404).send('Artista não encontrado');
        }
        const ep = artista.eps.id(req.params.epId);
        if (!ep) {
            return res.status(404).send('EP não encontrado');
        }
        ep.remove();
        artista.save().then(() => {
            res.redirect('/artistas/artistas');
        });
    }).catch((err) => {
        res.status(500).send('Ocorreu um erro ao tentar deletar o EP');
    });
});

module.exports = router;