import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "vendor"],
        default: 'user'
    },
    refreshToken: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Pre Hook to Hash ppassword before saving
userSchema.pre('save', async function(next){
    try {
        if(!this.isModified('passwordHash')) return next();
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        logger.error('Error hashing password:', error);
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.passwordHash);
    } catch (error) {
        logger.error('Error validating password:', error);
    }
}

const User = mongoose.model('User', userSchema);

export default User;