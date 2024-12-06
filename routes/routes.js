const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Componente = require('../models/componente');

// Configuración de la carpeta para guardar imágenes
const carpetaUpload = path.join(__dirname, '../upload');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, carpetaUpload);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
var upload = multer({ storage: storage });

// Página principal: listar componentes
router.get('/', async (req, res) => {
    try {
        const componentes = await Componente.find(); // Obtiene todos los componentes
        console.log("Componentes encontrados:", componentes); // Depuración en consola
        res.render('layouts/index', { componentes }); // Renderiza la vista con los datos
    } catch (error) {
        console.error("Error al obtener los componentes:", error);
        res.status(500).send('Error al obtener los componentes.');
    }
});

// Ruta para mostrar el formulario de creación
router.get('/crear', (req, res) => {
    res.render('layouts/crear'); // Asegúrate de usar 'layouts/'
});


// Guardar componente en la base de datos
// Guardar componente en la base de datos
router.post('/crear', upload.single('foto'), async (req, res) => {
    try {
        // Obtener la primera letra del nombre
        const primeraLetra = req.body.nombre.charAt(0).toUpperCase();

        // Buscar el último código que comienza con esa letra
        const ultimoComponente = await Componente.findOne({ codigo: { $regex: `^${primeraLetra}` } })
            .sort({ codigo: -1 }) // Ordenar de forma descendente
            .exec();

        // Generar el nuevo código
        let nuevoCodigo = `${primeraLetra}001`; // Código inicial por defecto
        if (ultimoComponente) {
            const ultimoNumero = parseInt(ultimoComponente.codigo.slice(1)); // Extraer el número del código
            nuevoCodigo = `${primeraLetra}${String(ultimoNumero + 1).padStart(3, '0')}`; // Incrementar el número
        }

        // Crear el nuevo componente
        const nuevoComponente = new Componente({
            codigo: nuevoCodigo, // Código generado automáticamente
            nombre: req.body.nombre,
            foto: req.file ? req.file.filename : null,
            descripcion: req.body.descripcion,
            cantidad: req.body.cantidad,
            precio: req.body.precio,
        });

        // Guardar en la base de datos
        await nuevoComponente.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error al crear el componente:', error);
        res.status(400).send('Error al crear el componente.');
    }
});


// Formulario para editar componente
router.get('/editar/:id', async (req, res) => {
    try {
        const componente = await Componente.findById(req.params.id);
        res.render('layouts/editar', { componente });
    } catch (error) {
        res.status(404).send('Componente no encontrado.');
    }
});

// Actualizar componente
router.post('/editar/:id', upload.single('foto'), async (req, res) => {
    try {
        const datosActualizados = {
            codigo: req.body.codigo,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            cantidad: req.body.cantidad,
            precio: req.body.precio,
        };
        if (req.file) datosActualizados.foto = req.file.filename;

        await Componente.findByIdAndUpdate(req.params.id, datosActualizados);
        res.redirect('/');
    } catch (error) {
        res.status(400).send('Error al actualizar el componente.');
    }
});

// Eliminar componente
router.get('/eliminar/:id', async (req, res) => {
    try {
        await Componente.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(400).send('Error al eliminar el componente.');
    }
});

module.exports = router;
