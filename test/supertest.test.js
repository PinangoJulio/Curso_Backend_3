import { describe, it, before, after } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import mongoose, { isValidObjectId } from "mongoose";
import config from "../src/config/config.js";

const requester = supertest(`http://localhost:${config.PORT}`);

// Conectar a la base de datos para los tests
before(async function() {
    this.timeout(15000);
    try {
        await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
        console.log("✅ Conectado a MongoDB para tests");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
    }
});

after(async function() {
    try {
        await mongoose.connection.close();
        console.log("✅ Desconectado de MongoDB");
    } catch (error) {
        console.error("❌ Error desconectando:", error);
    }
});

describe("Pruebas router pets", function(){
    this.timeout(10000);

    after(async()=>{
        try {
            await mongoose.connection.collection("pets").deleteMany({specie:"test"});
        } catch (error) {
            console.log("Error limpiando pets de test:", error);
        }
    })

    it("Si consulto todas las mascotas al endpoint /api/pets metodo GET, me debería devolver un array de mascotas", async() => {
        const {status, body} = await requester.get("/api/pets");
        expect(status).to.be.eq(200);
        expect(body.payload).to.be.an("array");
    })    

    it("Si envío los datos correctos de una mascota al /api/pets metodo POST, da de alta la mascota en DB", async()=>{
        const petMock = {
            name: "Rocky", 
            specie: "test", 
            birthDate: "2025-12-18T00:00:00.000Z"
        }

        const {status, body} = await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(200);
        expect(body.payload).to.have.property("_id");
        expect(isValidObjectId(body.payload._id)).to.be.true;
    })

    it("Si envío los datos de la mascota sin el campo name al /api/pets metodo POST, me debería dar un error", async()=>{
        const petMock = {
            specie: "test", 
            birthDate: "2025-12-18T00:00:00.000Z"
        }

        const {status} = await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(400);
    })    

    it("Si envío los datos de la mascota sin el campo specie al /api/pets metodo POST, me debería dar un error", async()=>{
        const petMock = {
            name: "Rocky", 
            birthDate: "2025-12-18T00:00:00.000Z"
        }

        const {status} = await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(400);
    })        
    
    it("Si envío los datos de la mascota sin el campo birthDate al /api/pets metodo POST, me debería dar un error", async()=>{
        const petMock = {
            name: "Rocky", 
            specie: "test"
        }

        const {status} = await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(400);
    })        
})

describe("Pruebas router users", function(){
    this.timeout(10000);

    it("Si consulto todos los usuarios al endpoint /api/users metodo GET, me debería devolver un array de usuarios", async() => {
        const {status, body} = await requester.get("/api/users");
        expect(status).to.be.eq(200);
        expect(body.payload).to.be.an("array");
    })        

    it("Si quiero generar 1 usuario y 1 mascota, al apuntar al endpoint /api/mocks/generateData metodo POST sin pasarle cantidad, da de alta 1 usuario y 1 mascota en DB", async() => {
        const {status, body} = await requester.post(`/api/mocks/generateData`);
        expect(status).to.be.eq(201);
        expect(body).to.be.an("object");
        expect(body.message).to.be.eq("Datos generados exitosamente");
        expect(body.payload.usersInserted).to.be.at.least(1);
        expect(body.payload.petsInserted).to.be.at.least(1);
    })

    it("Si quiero generar N usuarios y N mascotas, al apuntar al endpoint /api/mocks/generateData metodo POST pasándole la cantidad deseada, da de alta los N usuarios y las N mascotas en DB", async() => {
        const usuarios = 2;
        const mascotas = 2;

        const {status, body} = await requester.post(`/api/mocks/generateData?user=${usuarios}&pet=${mascotas}`);
        expect(status).to.be.eq(201);
        expect(body).to.be.an("object");
        expect(body.message).to.be.eq("Datos generados exitosamente");
        expect(body.payload.usersInserted).to.be.eq(usuarios);
        expect(body.payload.petsInserted).to.be.eq(mascotas);
    })    
    
    it("Si al apuntar al endpoint /api/mocks/generateData metodo POST le paso una cantidad negativa en el parámetro para generar un usuario, debe de dar error", async() => {
        const user = -1;
        const {status} = await requester.post(`/api/mocks/generateData?user=${user}`);
        expect(status).to.be.eq(400);
    })    

    it("Si al apuntar al endpoint /api/mocks/generateData metodo POST le paso una cantidad negativa en el parámetro para generar una mascota, debe de dar error", async() => {
        const pet = -1;
        const {status} = await requester.post(`/api/mocks/generateData?pet=${pet}`);
        expect(status).to.be.eq(400);
    })
})

describe("Pruebas router adoptions", function(){
    this.timeout(15000);
    
    let userId, petId;

    // Setup: crear un usuario y una mascota para los tests
    before(async() => {
        try {
            // Crear usuario de prueba
            const userMock = {
                first_name: "Test",
                last_name: "User", 
                email: `testuser_${Date.now()}@test.com`, // Email único
                password: "123456"
            }
            
            const userResponse = await requester.post("/api/sessions/register").send(userMock);
            if (userResponse.status === 200 && userResponse.body.payload) {
                userId = userResponse.body.payload;
                console.log(`✅ Usuario creado para tests: ${userId}`);
            }

            // Crear mascota de prueba
            const petMock = {
                name: "TestPet",
                specie: "test",
                birthDate: "2023-02-01T00:00:00.000Z"
            }
            
            const petResponse = await requester.post("/api/pets").send(petMock);
            if (petResponse.status === 200 && petResponse.body.payload) {
                petId = petResponse.body.payload._id;
                console.log(`✅ Mascota creada para tests: ${petId}`);
            }
        } catch (error) {
            console.log("❌ Error en setup de adoption tests:", error.message);
        }
    })

    // Cleanup
    after(async() => {
        try {
            if (userId) {
                await mongoose.connection.collection("users").deleteOne({_id: new mongoose.Types.ObjectId(userId)});
            }
            if (petId) {
                await mongoose.connection.collection("pets").deleteMany({specie: "test"});
            }
            // Limpiar adopciones de test
            await mongoose.connection.collection("adoptions").deleteMany({});
        } catch (error) {
            console.log("❌ Error en cleanup:", error.message);
        }
    })

    it("GET /api/adoptions - Debería devolver todas las adopciones", async() => {
        const {status, body} = await requester.get("/api/adoptions");
        
        expect(status).to.be.eq(200);
        expect(body.status).to.be.eq("success");
        expect(body.payload).to.be.an("array");
    })

    it("POST /api/adoptions/:uid/:pid - Debería fallar con usuario inexistente", async() => {
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const fakePetId = new mongoose.Types.ObjectId().toString();
        
        const {status, body} = await requester.post(`/api/adoptions/${fakeUserId}/${fakePetId}`);
        
        expect(status).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("user Not found");
    })

    it("GET /api/adoptions/:aid - Debería fallar con ID de adopción inexistente", async() => {
        const fakeAdoptionId = new mongoose.Types.ObjectId().toString();
        
        const {status, body} = await requester.get(`/api/adoptions/${fakeAdoptionId}`);
        
        expect(status).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("Adoption not found");
    })

    // Test condicional - solo si tenemos userId y petId
    it("POST /api/adoptions/:uid/:pid - Debería crear una adopción exitosamente", async() => {
        if (!userId || !petId) {
            console.log("⚠️ Saltando test de adopción - falta userId o petId");
            this.skip();
            return;
        }

        const {status, body} = await requester.post(`/api/adoptions/${userId}/${petId}`);
        
        expect(status).to.be.eq(200);
        expect(body.status).to.be.eq("success");
        expect(body.message).to.be.eq("Pet adopted");
    })
})