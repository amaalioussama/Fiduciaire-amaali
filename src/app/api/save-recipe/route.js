import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Simple MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(MONGODB_URI);
}

// Simple Recipe Schema inline
const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.models.SimpleRecipe || mongoose.model('SimpleRecipe', recipeSchema);

// POST - Create recipe (no auth required for testing)
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const recipe = new Recipe({
      title: body.title || 'Untitled Recipe',
      description: body.description || '',
      image: body.image || '',
      isPublished: body.isPublished || false,
    });
    
    await recipe.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recipe saved!',
      recipe: recipe 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// GET - List all recipes
export async function GET() {
  try {
    await connectDB();
    
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      recipes: recipes 
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
