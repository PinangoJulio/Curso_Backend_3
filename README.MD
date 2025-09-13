# 🐾 Adoptme - Sistema de Adopción de Mascotas

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![Express](https://img.shields.io/badge/Express.js-Framework-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Tests](https://img.shields.io/badge/Tests-Mocha%2FChai%2FSupertest-yellowgreen)

---

## 📝 Descripción
API REST para sistema de adopción de mascotas desarrollada con **Node.js**, **Express** y **MongoDB** como proyecto final del curso **Backend III - Coderhouse**.

---

## 🎯 Estado del Proyecto
- ✅ Implementar tests funcionales para todos los endpoints de adopciones  
- ✅ Documentar API con Swagger (módulo Users)  
- ✅ Dockerizar la aplicación  
- ✅ Desplegar imagen en DockerHub  

---

## 🚀 Tecnologías Utilizadas
- **Backend:** Node.js, Express.js  
- **Base de Datos:** MongoDB, Mongoose  
- **Testing:** Mocha, Chai, Supertest  
- **Documentación:** Swagger UI  
- **Containerización:** Docker  
- **Autenticación:** JWT, bcrypt  

---

## ⚡️ Quickstart
Ejecutá el proyecto en 3 pasos:

git clone https://github.com/PinangoJulio/Curso_Backend_3.git
cd Curso_Backend_3
npm install
npm run dev
La API estará disponible en:
👉 http://localhost:8080

📦 Instalación Local
Prerrequisitos
Node.js v20 o superior

MongoDB

Git

Pasos
Clonar el repositorio

 
git clone https://github.com/PinangoJulio/Curso_Backend_3.git
cd Curso_Backend_3
Instalar dependencias

 
npm install
Configurar variables de entorno creando el archivo .env en la raíz:

env
 
PORT=8080
MONGO_URL=mongodb://localhost:27017
DB_NAME=adoptme
JWT_SECRET=tu_clave_secreta_jwt
Iniciar la aplicación

 
# Desarrollo
npm run dev

# Producción
npm start
🧪 Testing
Ejecutar todos los tests:

 
npm test
Incluye:

✅ Endpoints de mascotas (Pets)

✅ Endpoints de usuarios (Users)

✅ Endpoints de adopciones (Adoptions)

✅ Generación de datos mock

📚 Documentación API
La documentación completa está disponible en:
👉 http://localhost:8080/docs

Endpoints principales
Método	Endpoint	Descripción
GET	/api/users	Obtener todos los usuarios
GET	/api/users/:uid	Obtener usuario por ID
PUT	/api/users/:uid	Actualizar usuario
DELETE	/api/users/:uid	Eliminar usuario
GET	/api/pets	Obtener todas las mascotas
POST	/api/pets	Crear nueva mascota
GET	/api/adoptions	Obtener todas las adopciones
GET	/api/adoptions/:aid	Obtener adopción por ID
POST	/api/adoptions/:uid/:pid	Crear nueva adopción

🐳 Docker
Construir imagen local
docker build -t adoptme-backend:1.0.0 .
Ejecutar contenedor
 
docker run -d \
  -p 8080:3000 \
  -e MONGO_URL="tu_mongo_url" \
  -e DB_NAME="adoptme" \
  --name adoptme-container \
  adoptme-backend:1.0.0
Imagen en DockerHub
Disponible en:
👉 DockerHub - pinangojulio/adoptme-backend

Descargar y ejecutar:

 
# Descargar imagen
docker pull pinangojulio/adoptme-backend:1.0.0

# Ejecutar contenedor
docker run -d \
  -p 8080:3000 \
  -e PORT=3000 \
  -e MONGO_URL="tu_mongo_url" \
  -e DB_NAME="adoptme" \
  --name adoptme-app \
  pinangojulio/adoptme-backend:1.0.0
🔧 Variables de Entorno
Variable	Descripción	Valor por defecto
PORT	Puerto del servidor	8080
MONGO_URL	URL de conexión MongoDB	mongodb://localhost:27017
DB_NAME	Nombre de la base de datos	adoptme
JWT_SECRET	Clave secreta para JWT	(requerida)

📁 Estructura del Proyecto
text
 
src/
├── controllers/     # Controladores de rutas
├── dao/             # Data Access Objects  
├── docs/            # Documentación Swagger
├── dto/             # Data Transfer Objects
├── models/          # Modelos de Mongoose
├── repository/      # Patrón Repository
├── routes/          # Definición de rutas
├── services/        # Servicios de negocio
├── utils/           # Utilidades
├── config/          # Configuración
└── app.js           # Archivo principal

test/                # Tests unitarios y funcionales
🧑‍💻 Scripts Disponibles
 
npm start    # Iniciar en producción
npm run dev  # Iniciar en desarrollo (nodemon)
npm test     # Ejecutar tests