//constantes que vamos a utilizar
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
//modelo componente
const componente = require("../models/componente")

//constante de la carpeta donde se guardan las fotos
const carpetaUpload = path.join(__dirname,'../upload')



//configurando el guardado de fotos
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,carpetaUpload)

    },
    filename: function(req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
})
var upload = multer({
    storage: storage
}).single(`image`)//para que esto funcione el encargado de crear la vista de crear componentes tiene
//que ponerle el nombre exacto image al campo de subir la imagen y el método tiene que se post
// porfavor usar forms en el html que en este caso son ejs -Axel Soto



//rutas aquí se crean las "Operaciones CRUD"
router.get('/',(req,res) =>{
    res.send('Pagina principal')
})

//Andy Route put

//Editar
//editar por id
router.get('/edit/:id', async(req, res)=>{
    const id = req.params.id

    try{
        
        const componente = await componente.findbyId(id)
        if (componente == null){
            res.redirect('/')

        }
        else {
            res.render('editcomponente',{
                titulo: 'Editar componente',
                componente: componente        
            })
        }
    }
    
    catch(error){
        res.status(500).send
    }
    //subir imagen
    router.post('/update:id', upload, async(req, res)=> {
        const id = req.params.id
        let new_image = ''

        if (req.file){
            new_file = req.file.filename

            try{
                //sustituir imagen vieja por una nueva
                fs.unlinkSync('./upload/' + req.body.old_image)
            }
            catch(error){
                console.log(error)
            }
        }
        else{
            new_images = req.body.old_image
        }
        try{
            await componente.findByIdAndUpdate(id,{
                //Campos de formulario
                nombre: req.body.name
            })
        }
    })
})

module.exports = router;