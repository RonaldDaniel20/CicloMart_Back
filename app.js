// Description: Archivo principal de la aplicación.
// Se encarga de configurar el servidor y las rutas de la API.
require('dotenv').config() // Cargar las variables de entorno

// Importar las dependencias necesarias
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan') // Middleware para mostrar los logs de las solicitudes
const rateLimt = require('express-rate-limit')

// Crear la aplicación de express
const app = express()
app.use(bodyParser.json()) // Convierte el cuerpo de la solicitud a objeto JS

// Permite solicitudes al api únicamente desde el frontend autorizado
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
}

//Limitación de número de solicitudes por ip
const limiter = rateLimt({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes desde está IP, intentalo nuevamente más tarde'
})

app.use(limiter)


app.use(cors(corsOptions))

// Muestra los logs de las solicitudes en la consola
morgan.token('requestBody', (request) => JSON.stringify(request.body))
app.use(morgan(' :method :url :response-time :requestBody'))

// Cargar las rutas de la API
app.use('/api', require('./routes/routes'))

module.exports = app
