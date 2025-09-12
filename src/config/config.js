import dotenv from 'dotenv';

dotenv.config();

export default  {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
    DB_NAME: process.env.DB_NAME || 'adoptme'
}