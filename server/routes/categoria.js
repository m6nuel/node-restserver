const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const categoriaDB = require('../models/categoria');

let app = express();

let Categoria = require('../models/categoria');

// ================================
//  Mostrar todas las Categorias
// ================================


app.get('/categoria', verificaToken, ( req, res ) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec( ( err, categorias ) => {
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categorias
        });

    }) 

})


// ================================
//  Mostrar una Categoria por ID
// ================================

app.get('/categoria/:id', verificaToken, ( req, res ) => {
    // Categoria.findByID(....);

    let id = req.params.id

    Categoria.findById( id, ( err, categoriaDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !categoriaDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })




})


// ================================
//  Crear Nueva Categoria
// ================================

app.post('/categoria', verificaToken, ( req, res ) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
})

// ================================
//  Actualizar Categoria
// ================================

app.put('/categoria/:id', verificaToken, ( req, res ) => {
    // regresa la nueva categoria
    // req.usuario._id

    let id = req.params.id;
    
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators: true }, ( err, categoriaDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})


// ================================
//  Borrar Categoria
// ================================

app.delete('/categoria/:id', [ verificaToken, verificaAdmin_Role ], ( req, res ) => {
    // Solo un administrador puede elimiar la categoria
    // categoria.findByIdandRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, ( err, categoriaDb ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no Existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })

    })
})





module.exports = app;