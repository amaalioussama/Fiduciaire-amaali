import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function DELETE(request) {
  try {
    await dbConnect();
    
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String,
    }));
    
    // Delete all admin users to allow fresh setup
    const result = await User.deleteMany({ role: 'admin' });
    
    return NextResponse.json({ 
      message: 'Admin account(s) deleted. You can now create a new admin account.',
      deleted: result.deletedCount
    });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
