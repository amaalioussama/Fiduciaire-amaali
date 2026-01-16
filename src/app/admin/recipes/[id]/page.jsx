'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = [
  'Starters',
  'Main Dishes',
  'Desserts',
  'Salads',
  'Soups',
  'Snacks',
  'Drinks',
  'Breakfast',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function RecipeEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const isEditing = params.id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: '',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    category: 'Main Dishes',
    cuisine: 'International',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: [{ step: 1, description: '' }],
    tags: [],
    isPublished: false,
    isFeatured: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (isEditing && status === 'authenticated') {
      fetchRecipe();
    }
  }, [isEditing, status]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recipes/${params.id}`);
      const data = await res.json();
      
      if (data.recipe) {
        setRecipe(data.recipe);
      }
    } catch (error) {
      toast.error('Error loading recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredient = (index) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index].description = value;
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, description: '' },
      ],
    }));
  };

  const removeInstruction = (index) => {
    const newInstructions = recipe.instructions
      .filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, step: i + 1 }));
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addTag = () => {
    if (tagInput.trim() && !recipe.tags.includes(tagInput.trim())) {
      setRecipe(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (publish = false) => {
    setSaving(true);
    
    const recipeData = {
      ...recipe,
      isPublished: publish ? true : recipe.isPublished,
    };

    try {
      const url = isEditing ? `/api/recipes/${params.id}` : '/api/recipes';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success(isEditing ? 'Recipe updated!' : 'Recipe created!');
      
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/dashboard"
                className="text-gray-600 hover:text-orange-600 transition"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Recipe' : 'New Recipe'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={recipe.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="E.g: Chicken Tajine with Preserved Lemons"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={recipe.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="A short description of the recipe..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={recipe.image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="https://example.com/image.jpg"
                  />
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt="Preview" 
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Ingredients</h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  + Add ingredient
                </button>
              </div>

              <div className="space-y-3">
                {recipe.ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={ing.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Qty"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Unit"
                    />
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ingredient name"
                    />
                    {recipe.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Instructions</h2>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  + Add step
                </button>
              </div>

              <div className="space-y-4">
                {recipe.instructions.map((inst, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">{inst.step}</span>
                    </div>
                    <textarea
                      value={inst.description}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Step ${inst.step}...`}
                    />
                    {recipe.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={recipe.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={recipe.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prep Time (min)
                    </label>
                    <input
                      type="number"
                      name="prepTime"
                      value={recipe.prepTime}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cook Time (min)
                    </label>
                    <input
                      type="number"
                      name="cookTime"
                      value={recipe.cookTime}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portions
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={recipe.servings}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine
                  </label>
                  <input
                    type="text"
                    name="cuisine"
                    value={recipe.cuisine}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="E.g: Italian"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Options</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={recipe.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700">Feature this recipe</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
