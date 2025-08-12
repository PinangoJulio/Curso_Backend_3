import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export const generateUsers = async (numUsers) => {
    const users = [];
    const encryptedPassword = await bcrypt.hash('coder123', 10);
    
    for (let i = 0; i < numUsers; i++) {
        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: encryptedPassword,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: []
        };
        users.push(user);
    }
    
    return users;
};

export const generatePets = (numPets) => {
    const pets = [];
    const species = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster'];
    const petNames = [
        'Bella', 'Max', 'Luna', 'Charlie', 'Lucy', 'Cooper', 'Daisy', 'Rocky',
        'Molly', 'Buddy', 'Sadie', 'Tucker', 'Maggie', 'Bear', 'Sophie', 'Duke',
        'Chloe', 'Jack', 'Lola', 'Harley', 'Zoe', 'Murphy', 'Lily', 'Bentley'
    ];
    
    for (let i = 0; i < numPets; i++) {
        const pet = {
            name: faker.helpers.arrayElement(petNames),
            specie: faker.helpers.arrayElement(species),
            birthDate: faker.date.past({ years: 10 }),
            adopted: faker.datatype.boolean(),
            image: `https://loremflickr.com/320/240/${faker.helpers.arrayElement(species)}`
        };
        pets.push(pet);
    }
    
    return pets;
};