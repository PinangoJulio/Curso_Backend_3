🐾 Adoptme - Sistema de Adopción de Mascotas
📝 Descripción
API REST para sistema de adopción de mascotas desarrollada con Node.js, Express y MongoDB como proyecto final del curso de Backend III de Coderhouse.

🎯 Estado del Proyecto
✅ Implementar tests funcionales para todos los endpoints de adopciones
✅ Documentar API con Swagger (módulo Users)
✅ Dockerizar la aplicación
✅ Desplegar imagen en DockerHub

🚀 Tecnologías Utilizadas
Backend: Node.js, Express.js

Base de Datos: MongoDB, Mongoose

Testing: Mocha, Chai, Supertest

Documentación: Swagger UI

Containerización: Docker

Autenticación: JWT, bcrypt

📦 Instalación Local
Prerrequisitos
Node.js v20 o superior

MongoDB

Git

Pasos de Instalación
Clonar el repositorio

bash
git clone https://github.com/PinangoJulio/Curso_Backend_3.git
cd Curso_Backend_3
Instalar dependencias

bash
npm install
Configurar variables de entorno
Crear archivo .env en la raíz del proyecto:

env
PORT=8080
MONGO_URL=mongodb://localhost:27017
DB_NAME=adoptme
JWT_SECRET=tu_clave_secreta_jwt
Iniciar la aplicación

bash
# Desarrollo
npm run dev

# Producción
npm start
🧪 Testing
Ejecutar todos los tests:

bash
npm test
Los tests incluyen:

✅ Tests de endpoints de mascotas (Pets)

✅ Tests de endpoints de usuarios (Users)

✅ Tests de endpoints de adopciones (Adoptions)

✅ Tests de generación de datos mock

📚 Documentación API
La documentación completa de la API está disponible en:
http://localhost:8080/docs

Endpoints Principales
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
bash
docker build -t adoptme-backend:1.0.0 .
Ejecutar contenedor
bash
docker run -d \
  -p 8080:3000 \
  -e MONGO_URL="tu_mongo_url" \
  -e DB_NAME="adoptme" \
  --name adoptme-container \
  adoptme-backend:1.0.0
Imagen en DockerHub
La imagen está disponible públicamente en:
https://hub.docker.com/r/pinangojulio/adoptme-backend

Descargar y ejecutar desde DockerHub:

bash
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
├── dao/            # Data Access Objects  
├── docs/           # Documentación Swagger
├── dto/            # Data Transfer Objects
├── models/         # Modelos de Mongoose
├── repository/     # Patrón Repository
├── routes/         # Definición de rutas
├── services/       # Servicios de negocio
├── utils/          # Utilidades
├── config/         # Configuración
└── app.js          # Archivo principal

test/               # Tests unitarios y funcionales
🧑‍💻 Scripts Disponibles
bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo (nodemon)
npm test           # Ejecutar tests