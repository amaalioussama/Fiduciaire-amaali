import mongoose from 'mongoose';
import slugify from 'slugify';

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a recipe title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  image: {
    type: String,
    default: '/images/default-recipe.jpg',
  },
  prepTime: {
    type: Number,
    required: true,
    default: 15,
  },
  cookTime: {
    type: Number,
    required: true,
    default: 30,
  },
  servings: {
    type: Number,
    required: true,
    default: 4,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  category: {
    type: String,
    required: true,
    enum: ['Starters', 'Main Dishes', 'Desserts', 'Salads', 'Soups', 'Snacks', 'Drinks', 'Breakfast'],
  },
  cuisine: {
    type: String,
    default: 'International',
  },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String },
  }],
  instructions: [{
    step: { type: Number, required: true },
    description: { type: String, required: true },
  }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Auto-generate slug before saving
RecipeSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Index for search
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
