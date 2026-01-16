import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    await dbConnect();
    
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true, minlength: 6 },
      role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
      avatar: { type: String, default: '/images/default-avatar.png' },
      isActive: { type: Boolean, default: true },
    }, { timestamps: true }));
    
    // Delete all existing admins
    await User.deleteMany({ role: 'admin' });
    
    // Create new admin with known credentials
    // Email: admin@fiduam.com
    // Password: Admin123!
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@fiduam.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Admin account created!',
      credentials: {
        email: 'admin@fiduam.com',
        password: 'Admin123!'
      },
      note: 'CHANGE YOUR PASSWORD AFTER LOGIN!'
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
