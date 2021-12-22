const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'No se a seleccionado ningun archivo'
                        }
                    })
    }

    // Validar tipo

    let tiposValidos = [ 'productos', 'usuarios' ];
    if ( tiposValidos.indexOf( tipo ) < 0 ) {

        return res.status(400).json({
            ok: false,
            err: {
                menssage: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
            }
        })
        
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[ nombreCortado.length - 1 ];

    // Extenciones permitidas

    let extencionesValidas = [ 'png', 'jpg', 'gif', 'jpeg' ];

        if ( extencionesValidas.indexOf( extension ) < 0 ) {

            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'Archivo no permitido, las extenciones validas son: ' + extencionesValidas.join(', '),
                    ext: extension
                }
            })
            
        }

        // Cambiar nombre al Archivo

        let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        
        if (err)
            return res.status(500).json({
                ok: false,
                err
        });


        // Aqui, imagen cargada
        if ( tipo === 'usuarios' ) {
            imagenUsuario(id, res, nombreArchivo)
            
        } else {
            imagenProducto( id, res, nombreArchivo )
        }

    });

});


function imagenUsuario( id, res, nombreArchivo ) {
        
    Usuario.findById( id, ( err, usuarioDB ) => {
        
        if ( err ) {
            borraArchivo( nombreArchivo, 'usuarios'  )

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !usuarioDB ) {
            
            borraArchivo( nombreArchivo, 'usuarios'  )
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no Existe'
                }
            })
        }
        
        borraArchivo( usuarioDB.img, 'usuarios'  )
        
        usuarioDB.img = nombreArchivo;
        console.log(usuarioDB)
        
        usuarioDB.save( ( err, usuarioGuardado ) => {
            
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
            
        })
        
    });
}

function imagenProducto( id, res, nombreArchivo ) {

    Producto.findById( id, ( err, productoDb ) => {
        
        if ( err ) {
            borraArchivo( nombreArchivo, 'usuarios'  )

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !productoDb ) {
            
            borraArchivo( nombreArchivo, 'productos'  )
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no Existe'
                }
            })
        }
        
        borraArchivo( productoDb.img, 'productos'  )
        
        productoDb.img = nombreArchivo;
        console.log(productoDb)
        
        productoDb.save( ( err, productoGuardado ) => {
            
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
            
        })
        
    });

}

function borraArchivo(nombreImagen, tipo) {
    
    
            let pathImagen = path.resolve( __dirname , `../../uploads/${ tipo }/${ nombreImagen }`);
    
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }

    
}
    


module.exports = app;