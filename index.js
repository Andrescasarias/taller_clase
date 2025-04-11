// Importar librerías
const express = require('express');
const connection = require('./db');

// Crear app con Express
const app = express();

// Middleware para parsear JSON y datos por URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Puerto del servidor
const PORT = 5000;

// RUTAS DE PRUEBA 
app.get('/api/prueba', (req, res) => {
    res.send('Estoy respondiendo por la API');
});

app.get('/api/prueba2', (req, res) => {
    res.status(200).json({
        message: ' La API funciona bien',
        port: PORT,
        status: ' fue exitoso'
    });
});

// API PERSONA 

// Guardar persona
app.post('/api/persona', (req, res) => {
    const { id, nombre, apellido1, apellido2, dni } = req.body;
    const query = 'INSERT INTO persona (id, nombre, apellido1, apellido2, dni) VALUES ($1, $2, $3, $4, $5)';

    connection.query(query, [id, nombre, apellido1, apellido2, dni], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando la persona',
                details: error.message
            });
        } else {
            res.status(201).json({ id, nombre, apellido1, apellido2, dni });
        }
    });
});

// Obtener todas las personas
app.get('/api/persona', (req, res) => {
    const query = 'SELECT * FROM persona';

    connection.query(query, (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al recuperar los datos",
                details: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla persona",
                data: result.rows
            });
        }
    });
});

// Eliminar persona por ID
app.delete('/api/persona/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM persona WHERE id = $1';

    connection.query(query, [id], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar la persona",
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe ninguna persona con id ${id}`,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Persona eliminada correctamente"
            });
        }
    });
});

// Actualizar persona por ID
app.put('/api/persona/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido1, apellido2, dni } = req.body;
    const query = 'UPDATE persona SET nombre = $1, apellido1 = $2, apellido2 = $3, dni = $4 WHERE id = $5';

    connection.query(query, [nombre, apellido1, apellido2, dni, id], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar la persona',
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encontró ninguna persona con el ID ${id}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Persona actualizada correctamente',
                updated: {
                    id,
                    nombre,
                    apellido1,
                    apellido2,
                    dni
                }
            });
        }
    });
});

// API COCHE

// Crear coche
app.post('/api/coche', (req, res) => {
    const { matricula, marca, modelo, caballos, persona_id } = req.body;
    const query = 'INSERT INTO coche (matricula, marca, modelo, caballos, persona_id) VALUES ($1, $2, $3, $4, $5)';

    connection.query(query, [matricula, marca, modelo, caballos, persona_id], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear el coche',
                details: error.message
            });
        } else {
            res.status(201).json({ matricula, marca, modelo, caballos, persona_id });
        }
    });
});

// Obtener todos los coches
app.get('/api/coche', (req, res) => {
    const query = 'SELECT * FROM coche';

    connection.query(query, (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al recuperar los datos de coches",
                details: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla coche",
                data: result.rows
            });
        }
    });
});

// Eliminar coche por matrícula
app.delete('/api/coche/:matricula', (req, res) => {
    const { matricula } = req.params;
    const query = 'DELETE FROM coche WHERE matricula = $1';

    connection.query(query, [matricula], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar el coche",
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encuentra ningún coche con matrícula ${matricula}`,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Coche fue eliminado exitosamente "
            });
        }
    });
});

// Actualizar coche por matrícula
app.put('/api/coche/:matricula', (req, res) => {
    const { matricula } = req.params;
    const { marca, modelo, caballos, persona_id } = req.body;
    const query = 'UPDATE coche SET marca = $1, modelo = $2, caballos = $3, persona_id = $4 WHERE matricula = $5';

    connection.query(query, [marca, modelo, caballos, persona_id, matricula], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el coche',
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encontró ningún coche con la matrícula que nos das  ${matricula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Coche actualizado correctamente',
                updated: {
                    matricula,
                    marca,
                    modelo,
                    caballos,
                    persona_id
                }
            });
        }
    });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
