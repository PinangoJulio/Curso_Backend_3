import { describe, it, before, after } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import mongoose, { isValidObjectId } from "mongoose";

// Importar configuración (ajusta la ruta según tu estructura)
const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://admin:2399@cluster0.40i7iam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    DB_NAME: process.env.DB_NAME || 'adoptme'
};

const requester = supertest(`http://localhost:${config.PORT}`);

// Conectar a la base de datos para los tests
before(async function() {
    this.timeout(10000);
    await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
});

after(async function() {
    await mongoose.connection.close();
});

describe("Pruebas router pets", function(){
    this.timeout(10_000) // 10 segundos

    after(async()=>{
        await mongoose.connection.collection("pets").deleteMany({specie:"test"});
    })

    it("Si consulto todas las mascotas al endpoint /api/pets metodo GET, me debería devolver un array de mascotas", async() => {
        let {body} = await requester.get("/api/pets").send();
        expect(body.payload).to.be.an("array");
    })    

    it("Si envío los datos correctos de una mascota al /api/pets metodo POST, da de alta la mascota en DB", async()=>{
        let petMock={
            name: "Rocky", 
            specie: "test", 
            birthDate: new Date(2025, 11, 18).toISOString()
        }

        let {status, body}=await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(200);
        expect(body.payload).to.have.property("_id");
        expect(isValidObjectId(body.payload._id)).to.be.true;
    })

    it("Si envío los datos de la mascota sin el campo name al /api/pets metodo POST, me debería dar un error", async()=>{
        let petMock={
            //name: "Rocky", 
            specie: "test", 
            birthDate: new Date(2025, 11, 18).toISOString()
        }

        let {status}=await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(400);
    })    

    it("Si envío los datos de la mascota sin el campo specie al /api/pets metodo POST, me debería dar un error", async()=>{
        let petMock={
            name: "Rocky", 
            //specie: "test", 
            birthDate: new Date(2025, 11, 18).toISOString()
        }

        let {status}=await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(400);
    })        
    
    it("Si envío los datos de la mascota sin el campo birthDate al /api/pets metodo POST, me debería dar un error", async()=>{
        let petMock={
            name: "Rocky", 
            specie: "test" 
            //birthDate: new Date(2025, 11, 18).toISOString()
        }

        let {status}=await requester.post("/api/pets").send(petMock);
        expect(status).to.be.eq(400);
    })        
})

describe("Pruebas router users", function(){
    this.timeout(10_000) // 10 segundos

    it("Si consulto todos los usuarios al endpoint /api/users metodo GET, me debería devolver un array de usuarios", async() => {
        let {body} = await requester.get("/api/users").send();
        expect(body.payload).to.be.an("array");
    })        

    it("Si quiero generar 1 usuario y 1 mascota, al apuntar al endpoint /api/mocks/generateData metodo POST sin pasarle cantidad, da de alta 1 usuario y 1 mascota en DB", async() => {
        let {status, body}=await requester.post(`/api/mocks/generateData`).send();
        expect(status).to.be.eq(201);
        expect(body).to.be.an("object");
        expect(body.message).to.be.eq("Datos generados exitosamente");
    })

    it("Si quiero generar N usuarios y N mascotas, al apuntar al endpoint /api/mocks/generateData metodo POST pasándole la cantidad deseada, da de alta los N usuarios y las N mascotas en DB", async() => {
        let usuarios=3;
        let mascotas=3;

        let {status, body}=await requester.post(`/api/mocks/generateData/?user=${usuarios}&pet=${mascotas}`).send();
        expect(status).to.be.eq(201);
        expect(body).to.be.an("object");
        expect(body.message).to.be.eq("Datos generados exitosamente");
    })    
    
    it("Si al apuntar al endpoint /api/mocks/generateData metodo POST le paso una cantidad negativa en el parámetro para generar un usuario, debe de dar error", async() => {
        let user = -1;
        let {status}=await requester.post(`/api/mocks/generateData/?user=${user}`).send();
        expect(status).to.be.eq(400);
    })    

    it("Si al apuntar al endpoint /api/mocks/generateData metodo POST le paso una cantidad negativa en el parámetro para generar una mascota, debe de dar error", async() => {
        let pet = -1;
        let {status}=await requester.post(`/api/mocks/generateData/?pet=${pet}`).send();
        expect(status).to.be.eq(400);
    })
})

describe("Pruebas router adoptions", function(){
    this.timeout(10_000);
    
    let userId, petId, adoptionId;

    // Setup: crear un usuario y una mascota para los tests
    before(async() => {
        try {
            // Crear usuario de prueba
            const userMock = {
                first_name: "Test",
                last_name: "User", 
                email: "testuser@test.com",
                password: "123456"
            }
            
            const userResponse = await requester.post("/api/sessions/register").send(userMock);
            userId = userResponse.body.payload;

            // Crear mascota de prueba
            const petMock = {
                name: "TestPet",
                specie: "test",
                birthDate: new Date(2023, 1, 1).toISOString()
            }
            
            const petResponse = await requester.post("/api/pets").send(petMock);
            petId = petResponse.body.payload._id;
        } catch (error) {
            console.log("Error en setup de adoption tests:", error.message);
        }
    })

    // Cleanup
    after(async() => {
        try {
            if (userId) {
                await mongoose.connection.collection("users").deleteOne({_id: new mongoose.Types.ObjectId(userId)});
            }
            if (petId) {
                await mongoose.connection.collection("pets").deleteOne({_id: new mongoose.Types.ObjectId(petId)});
            }
            if (adoptionId) {
                await mongoose.connection.collection("adoptions").deleteOne({_id: new mongoose.Types.ObjectId(adoptionId)});
            }
        } catch (error) {
            console.log("Error en cleanup:", error.message);
        }
    })

    it("GET /api/adoptions - Debería devolver todas las adopciones", async() => {
        const {status, body} = await requester.get("/api/adoptions");
        
        expect(status).to.be.eq(200);
        expect(body.status).to.be.eq("success");
        expect(body.payload).to.be.an("array");
    })

    it("POST /api/adoptions/:uid/:pid - Debería crear una adopción exitosamente", async() => {
        if (!userId || !petId) {
            console.log("Saltando test - no hay userId o petId");
            return;
        }

        const {status, body} = await requester.post(`/api/adoptions/${userId}/${petId}`);
        
        expect(status).to.be.eq(200);
        expect(body.status).to.be.eq("success");
        expect(body.message).to.be.eq("Pet adopted");
    })

    it("POST /api/adoptions/:uid/:pid - Debería fallar con usuario inexistente", async() => {
        if (!petId) {
            console.log("Saltando test - no hay petId");
            return;
        }

        const fakeUserId = new mongoose.Types.ObjectId().toString();
        
        const {status, body} = await requester.post(`/api/adoptions/${fakeUserId}/${petId}`);
        
        expect(status).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("user Not found");
    })

    it("POST /api/adoptions/:uid/:pid - Debería fallar con mascota inexistente", async() => {
        if (!userId) {
            console.log("Saltando test - no hay userId");
            return;
        }

        const fakePetId = new mongoose.Types.ObjectId().toString();
        
        const {status, body} = await requester.post(`/api/adoptions/${userId}/${fakePetId}`);
        
        expect(status).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("Pet not found");
    })

    it("GET /api/adoptions/:aid - Debería obtener una adopción por ID", async() => {
        // Primero obtener todas las adopciones para conseguir un ID
        const adoptionsResponse = await requester.get("/api/adoptions");
        
        if(adoptionsResponse.body.payload.length > 0) {
            const firstAdoptionId = adoptionsResponse.body.payload[0]._id;
            
            const {status, body} = await requester.get(`/api/adoptions/${firstAdoptionId}`);
            
            expect(status).to.be.eq(200);
            expect(body.status).to.be.eq("success");
            expect(body.payload).to.be.an("object");
            expect(body.payload._id).to.be.eq(firstAdoptionId);
        } else {
            console.log("No hay adopciones para probar el GET por ID");
        }
    })

    it("GET /api/adoptions/:aid - Debería fallar con ID de adopción inexistente", async() => {
        const fakeAdoptionId = new mongoose.Types.ObjectId().toString();
        
        const {status, body} = await requester.get(`/api/adoptions/${fakeAdoptionId}`);
        
        expect(status).to.be.eq(404);
        expect(body.status).to.be.eq("error");
        expect(body.error).to.be.eq("Adoption not found");
    })
})