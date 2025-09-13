import User from '../dao/models/user.model.js';
import Pet from '../dao/models/pet.model.js';
import mongoose from 'mongoose';

// Modelo para adopciones
const adoptionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    }
}, {
    timestamps: true
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

// Servicio de usuarios
export const usersService = {
    getAll: () => User.find(),
    getUserById: (id) => User.findById(id),
    getUserByEmail: (email) => User.findOne({ email }),
    create: (userData) => User.create(userData),
    update: (id, updateData) => User.findByIdAndUpdate(id, updateData, { new: true }),
    delete: (id) => User.findByIdAndDelete(id)
};

// Servicio de mascotas
export const petsService = {
    getAll: () => Pet.find(),
    getBy: (params) => Pet.findOne(params),
    create: (petData) => Pet.create(petData),
    update: (id, updateData) => Pet.findByIdAndUpdate(id, updateData, { new: true }),
    delete: (id) => Pet.findByIdAndDelete(id)
};

// Servicio de adopciones
export const adoptionsService = {
    getAll: () => Adoption.find().populate('owner').populate('pet'),
    getBy: (params) => Adoption.findOne(params).populate('owner').populate('pet'),
    create: (adoptionData) => Adoption.create(adoptionData),
    update: (id, updateData) => Adoption.findByIdAndUpdate(id, updateData, { new: true }),
    delete: (id) => Adoption.findByIdAndDelete(id)
};