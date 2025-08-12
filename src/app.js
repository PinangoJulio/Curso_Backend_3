import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mocksRouter from './routes/mocks.router.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mockingdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Routes
app.use('/api/mocks', mocksRouter);


app.get('/', (req, res) => {
    res.json({
        message: 'API AdoptMe - Mocks funcionando',
        endpoints: [
            'GET /api/mocks/mockingpets',
            'GET /api/mocks/mockingusers', 
            'POST /api/mocks/generateData'
        ]
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`📡 http://localhost:${PORT}`);
});

export default app;