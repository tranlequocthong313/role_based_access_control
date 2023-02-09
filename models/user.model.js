const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const { roles } = require('../helpers/constants');

const userSchema = new Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: [roles.admin, roles.moderator, roles.client], default: roles.client }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
        if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) this.role = roles.admin;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
};

const User = model('user', userSchema);
module.exports = User;
