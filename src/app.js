import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import config from './config/config.js';

const app = express();
const PORT = config.PORT;

// Conexión a MongoDB
const connection = mongoose.connect(config.MONGO_URL, {dbName: config.DB_NAME})
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch((err) => {
        console.error("Error conectando a MongoDB:", err);
        process.exit(1);
    });

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Adoptme API",
            version: "1.0.0",
            description: "API para sistema de adopción de mascotas"
        }
    },
    apis: ["./src/docs/*.yaml"]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Documentación Swagger
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

export default app;