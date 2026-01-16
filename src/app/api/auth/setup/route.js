import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define User schema directly to avoid any import issues
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  avatar: { type: String, default: '/images/default-avatar.png' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get or create User model
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        error: 'Un compte administrateur existe déjà',
        message: 'Connectez-vous avec vos identifiants' 
      }, { status: 400 });
    }

    const body = await request.json();
    
    // Create admin with plain password - the User model will hash it
    const admin = await User.create({
      name: body.name || 'Admin',
      email: body.email,
      password: body.password,  // Let the model's pre-save hook hash this
      role: 'admin',
    });

    return NextResponse.json({ 
      message: 'Compte administrateur créé avec succès',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Setup error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
