const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

const Producto = require('../models/producto');

let app = express();



// ====================================
//      Obtener Productos
// ====================================


app.get( '/productos', verificaToken, ( req, res ) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(5)
            .populate( 'usuario', 'nombre email' )
            .populate( 'categoria', 'descripcion' )
            .exec( ( err, productos ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            })

})


// ====================================
//      Obtener Un Producto por id
// ====================================


app.get( '/productos/:id', verificaToken, ( req, res ) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById( id )
            .populate( 'usuario', 'nombre email' )
            .populate( 'categoria', 'nombre' )
            .exec( ( err, productoDB ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if ( !productoDB ) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'ID no existe'
                        }
                    })
                }

                res.json({
                    ok: true,
                    producto: productoDB
                })


            })

})




// ====================================
//      Crear Un Producto
// ====================================


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i')

    Producto.find( { nombre: regex } )
            .populate( 'categoria', 'nombre' )
            .exec( ( err, productos ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    productos
                })


            })

})


// ====================================
//      Crear Un Producto
// ====================================


app.post( '/productos', verificaToken, ( req, res ) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
    
})


// ====================================
//      Actualizar Un Producto
// ====================================


app.put( '/productos/:id', verificaToken, ( req, res ) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;
    
    let body = req.body;


    Producto.findById( id, ( err, productoDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save( ( err, productoGuardado ) => {
        
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
            
        })
    })

    
})


// ====================================
//      Borrar Un Producto
// ====================================


app.delete( '/productos/:id', verificaToken, ( req, res ) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;

    Producto.findById( id, ( err, productoDB ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save( ( err, productoBorrado ) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })

        })

    })
    
})

module.exports = app;