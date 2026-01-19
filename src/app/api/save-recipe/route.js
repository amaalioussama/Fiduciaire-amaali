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

// Helper to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// SEO-Optimized Recipe Schema
const recipeSchema = new mongoose.Schema({
  // Basic Info
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: String,
  image: String,
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  
  // SEO Fields
  focus_keyword: String,
  nlp_keywords: [String],
  meta_description: String,
  
  // Content Sections
  introduction: String,
  
  // Ingredients array
  ingredients: [{
    name: String,
    amount: String,
    unit: String,
    notes: String
  }],
  
  // Timing
  preparation_time: Number,
  cooking_time: Number,
  total_time: Number,
  servings: Number,
  
  // Steps array
  steps: [{
    step_number: Number,
    instruction: String,
    tip: String
  }],
  
  // Nutritional Information
  nutritional_info: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
    sugar: String,
    sodium: String
  },
  
  // Additional SEO Content Sections
  healthy_alternatives: String,
  serving_suggestions: String,
  common_mistakes: String,
  storing_tips: String,
  conclusion: String,
  
  // FAQs for rich snippets
  faqs: [{
    question: String,
    answer: String
  }]
});

const Recipe = mongoose.models.SimpleRecipe || mongoose.model('SimpleRecipe', recipeSchema);

// POST - Create or Update recipe
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate slug from title if not provided
    const slug = body.slug || generateSlug(body.title || 'untitled');
    
    // Parse JSON strings if they come as strings
    let ingredients = body.ingredients || [];
    let steps = body.steps || [];
    let faqs = body.faqs || [];
    let nlp_keywords = body.nlp_keywords || [];
    let nutritional_info = body.nutritional_info || {};
    
    // Handle case where these come as JSON strings
    if (typeof ingredients === 'string') ingredients = JSON.parse(ingredients);
    if (typeof steps === 'string') steps = JSON.parse(steps);
    if (typeof faqs === 'string') faqs = JSON.parse(faqs);
    if (typeof nlp_keywords === 'string') nlp_keywords = nlp_keywords.split(',').map(k => k.trim());
    if (typeof nutritional_info === 'string') nutritional_info = JSON.parse(nutritional_info);
    
    const recipeData = {
      title: body.title || 'Untitled Recipe',
      slug: slug,
      description: body.description || '',
      image: body.image || '',
      isPublished: body.isPublished || false,
      
      // SEO Fields
      focus_keyword: body.focus_keyword || '',
      nlp_keywords: nlp_keywords,
      meta_description: body.meta_description || '',
      
      // Content
      introduction: body.introduction || '',
      ingredients: ingredients,
      
      // Timing
      preparation_time: parseInt(body.preparation_time) || 0,
      cooking_time: parseInt(body.cooking_time) || 0,
      total_time: parseInt(body.total_time) || 0,
      servings: parseInt(body.servings) || 0,
      
      // Steps
      steps: steps,
      
      // Nutrition
      nutritional_info: nutritional_info,
      
      // Additional sections
      healthy_alternatives: body.healthy_alternatives || '',
      serving_suggestions: body.serving_suggestions || '',
      common_mistakes: body.common_mistakes || '',
      storing_tips: body.storing_tips || '',
      conclusion: body.conclusion || '',
      
      // FAQs
      faqs: faqs
    };
    
    let recipe;
    
    // If ID provided, update existing recipe
    if (body._id) {
      recipe = await Recipe.findByIdAndUpdate(body._id, recipeData, { new: true });
    } else {
      recipe = new Recipe(recipeData);
      await recipe.save();
    }
    
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
