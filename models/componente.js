const mongoose = require('mongoose');

// Definir el esquema del componente
const componenteSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true, // Obligatorio
        unique: true     // No se puede repetir
    },
    nombre: {
        type: String,
        required: true   // Obligatorio
    },
    foto: {
        type: String,    // Guardará la URL de la imagen
        required: true
    },
    descripcion: {
        type: String,    // Detalles adicionales del artículo
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0           // No se permite un inventario negativo
    },
    precio: {
        type: Number,
        required: true,
        min: 0           // No se permite un precio negativo
    }
}, {
    timestamps: true // Agrega las fechas `createdAt` y `updatedAt`
});

// Crear el modelo
const Componente = mongoose.model('Componente', componenteSchema);

module.exports = Componente;
