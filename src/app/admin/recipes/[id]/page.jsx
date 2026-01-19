'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecipeEditor() {
  const params = useParams();
  const router = useRouter();
  const isEditing = params.id !== 'new';
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageType, setImageType] = useState('url');
  const [imagePreview, setImagePreview] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  
  // Full recipe state with all SEO fields
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: '',
    isPublished: false,
    
    // SEO Fields
    focus_keyword: '',
    nlp_keywords: '',
    meta_description: '',
    
    // Content
    introduction: '',
    
    // Timing
    preparation_time: '',
    cooking_time: '',
    total_time: '',
    servings: '',
    
    // Ingredients array
    ingredients: [{ name: '', amount: '', unit: '', notes: '' }],
    
    // Steps array
    steps: [{ step_number: 1, instruction: '', tip: '' }],
    
    // Nutritional info
    nutritional_info: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: ''
    },
    
    // Additional sections
    healthy_alternatives: '',
    serving_suggestions: '',
    common_mistakes: '',
    storing_tips: '',
    conclusion: '',
    
    // FAQs
    faqs: [{ question: '', answer: '' }]
  });

  // Load recipe if editing
  useEffect(() => {
    if (isEditing) {
      loadRecipe();
    }
  }, [isEditing, params.id]);

  const loadRecipe = async () => {
    try {
      const res = await fetch('/api/save-recipe');
      const data = await res.json();
      const found = data.recipes?.find(r => r._id === params.id);
      if (found) {
        setRecipe({
          ...found,
          nlp_keywords: Array.isArray(found.nlp_keywords) ? found.nlp_keywords.join(', ') : found.nlp_keywords || '',
          ingredients: found.ingredients?.length ? found.ingredients : [{ name: '', amount: '', unit: '', notes: '' }],
          steps: found.steps?.length ? found.steps : [{ step_number: 1, instruction: '', tip: '' }],
          faqs: found.faqs?.length ? found.faqs : [{ question: '', answer: '' }],
          nutritional_info: found.nutritional_info || {
            calories: '', protein: '', carbs: '', fat: '', fiber: '', sugar: '', sodium: ''
          }
        });
        if (found.image) {
          setImagePreview(found.image);
          setImageType(found.image.startsWith('data:') ? 'upload' : 'url');
        }
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
    
    // Auto-preview image URL
    if (name === 'image' && value.startsWith('http')) {
      setImagePreview(value);
    }
  };

  const handleNutritionChange = (field, value) => {
    setRecipe(prev => ({
      ...prev,
      nutritional_info: { ...prev.nutritional_info, [field]: value }
    }));
  };

  // Ingredients handlers
  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '', notes: '' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Steps handlers
  const addStep = () => {
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, { step_number: prev.steps.length + 1, instruction: '', tip: '' }]
    }));
  };

  const updateStep = (index, field, value) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeStep = (index) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, step_number: i + 1 }))
    }));
  };

  // FAQ handlers
  const addFaq = () => {
    setRecipe(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    setRecipe(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFaq = (index) => {
    setRecipe(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 5MB' });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setRecipe(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Submit handler
  const handleSubmit = async (publish = false) => {
    if (!recipe.title.trim()) {
      setMessage({ type: 'error', text: 'Recipe title is required!' });
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      // Filter out empty items
      const filteredIngredients = recipe.ingredients.filter(i => i.name.trim());
      const filteredSteps = recipe.steps.filter(s => s.instruction.trim());
      const filteredFaqs = recipe.faqs.filter(f => f.question.trim() && f.answer.trim());
      
      const payload = {
        ...recipe,
        isPublished: publish,
        ingredients: filteredIngredients,
        steps: filteredSteps.map((s, i) => ({ ...s, step_number: i + 1 })),
        faqs: filteredFaqs,
        nlp_keywords: recipe.nlp_keywords
      };
      
      // Add ID if editing
      if (isEditing) {
        payload._id = params.id;
      }
      
      const res = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: publish ? 'Recipe published!' : 'Recipe saved as draft!' });
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save recipe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving recipe' });
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Navigation sections
  const sections = [
    { id: 'basic', label: '📝 Basic Info' },
    { id: 'seo', label: '🔍 SEO' },
    { id: 'content', label: '📖 Introduction' },
    { id: 'ingredients', label: '🥗 Ingredients' },
    { id: 'timing', label: '⏱️ Timing' },
    { id: 'steps', label: '👨‍🍳 Steps' },
    { id: 'nutrition', label: '🍎 Nutrition' },
    { id: 'tips', label: '💡 Tips & Extras' },
    { id: 'faqs', label: '❓ FAQs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/dashboard"
                className="text-gray-600 hover:text-orange-600 transition"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Recipe' : 'New SEO Recipe'}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="w-48 shrink-0 hidden md:block">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <ul className="space-y-2">
                {sections.map(section => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        activeSection === section.id
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mobile Section Selector */}
          <div className="md:hidden w-full mb-4">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>{section.label}</option>
              ))}
            </select>
          </div>

          {/* Main Form */}
          <main className="flex-1 space-y-6">
            
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">📝 Basic Information</h2>
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Recipe Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={recipe.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Classic Chocolate Chip Cookies"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Short Description</label>
                  <textarea
                    name="description"
                    value={recipe.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="A brief summary of the recipe..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Featured Image</label>
                  <div className="flex gap-4 mb-4">
                    <button type="button" onClick={() => setImageType('url')} className={`px-4 py-2 rounded-lg font-medium transition ${imageType === 'url' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🔗 URL</button>
                    <button type="button" onClick={() => setImageType('upload')} className={`px-4 py-2 rounded-lg font-medium transition ${imageType === 'upload' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>📁 Upload</button>
                  </div>
                  {imageType === 'url' ? (
                    <input type="url" name="image" value={recipe.image?.startsWith('data:') ? '' : recipe.image} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="https://example.com/image.jpg" />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-4xl mb-2 block">📷</span>
                        <span className="text-gray-600">Click to upload (Max 5MB)</span>
                      </label>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" onError={() => setImagePreview('')} />
                      <button type="button" onClick={() => { setImagePreview(''); setRecipe(prev => ({ ...prev, image: '' })); }} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600">✕</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEO Section */}
            {activeSection === 'seo' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">🔍 SEO Optimization</h2>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Focus Keyword</label>
                  <input type="text" name="focus_keyword" value={recipe.focus_keyword} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="e.g., chocolate chip cookies recipe" />
                  <p className="text-sm text-gray-500 mt-1">The main keyword you want to rank for</p>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">NLP Keywords (comma-separated)</label>
                  <input type="text" name="nlp_keywords" value={recipe.nlp_keywords} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="homemade cookies, baking tips, dessert recipes" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Meta Description</label>
                  <textarea name="meta_description" value={recipe.meta_description} onChange={handleChange} rows={3} maxLength={160} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="A compelling description for search results (max 160 characters)" />
                  <p className="text-sm text-gray-500 mt-1">{recipe.meta_description?.length || 0}/160 characters</p>
                </div>
              </div>
            )}

            {/* Introduction Section */}
            {activeSection === 'content' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">📖 Introduction</h2>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Recipe Introduction</label>
                  <textarea name="introduction" value={recipe.introduction} onChange={handleChange} rows={8} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Write an engaging introduction about the recipe, its history, why it's special..." />
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            {activeSection === 'ingredients' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">🥗 Ingredients</h2>
                  <button onClick={addIngredient} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition font-medium">+ Add</button>
                </div>
                <div className="space-y-4">
                  {recipe.ingredients.map((ing, index) => (
                    <div key={index} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1 grid grid-cols-4 gap-3">
                        <input type="text" value={ing.amount} onChange={(e) => updateIngredient(index, 'amount', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Amount" />
                        <input type="text" value={ing.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Unit" />
                        <input type="text" value={ing.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Ingredient name" />
                      </div>
                      <button onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700 p-2" disabled={recipe.ingredients.length === 1}>🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timing Section */}
            {activeSection === 'timing' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">⏱️ Time & Servings</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block font-semibold text-gray-700 mb-2">Prep Time (min)</label><input type="number" name="preparation_time" value={recipe.preparation_time} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="15" min="0" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Cook Time (min)</label><input type="number" name="cooking_time" value={recipe.cooking_time} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="30" min="0" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Total Time (min)</label><input type="number" name="total_time" value={recipe.total_time} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="45" min="0" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Servings</label><input type="number" name="servings" value={recipe.servings} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="4" min="1" /></div>
                </div>
              </div>
            )}

            {/* Steps Section */}
            {activeSection === 'steps' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">👨‍🍳 Cooking Steps</h2>
                  <button onClick={addStep} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition font-medium">+ Add Step</button>
                </div>
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{index + 1}</span>
                        <span className="font-semibold text-gray-700">Step {index + 1}</span>
                        <button onClick={() => removeStep(index)} className="ml-auto text-red-500 hover:text-red-700" disabled={recipe.steps.length === 1}>🗑️ Remove</button>
                      </div>
                      <textarea value={step.instruction} onChange={(e) => updateStep(index, 'instruction', e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3" placeholder="Describe this step..." />
                      <input type="text" value={step.tip} onChange={(e) => updateStep(index, 'tip', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="💡 Pro tip for this step (optional)" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Section */}
            {activeSection === 'nutrition' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">🍎 Nutritional Information</h2>
                <p className="text-gray-600">Per serving (optional)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><label className="block font-semibold text-gray-700 mb-2">Calories</label><input type="number" value={recipe.nutritional_info.calories} onChange={(e) => handleNutritionChange('calories', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="250" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Protein</label><input type="text" value={recipe.nutritional_info.protein} onChange={(e) => handleNutritionChange('protein', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="10g" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Carbs</label><input type="text" value={recipe.nutritional_info.carbs} onChange={(e) => handleNutritionChange('carbs', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="30g" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Fat</label><input type="text" value={recipe.nutritional_info.fat} onChange={(e) => handleNutritionChange('fat', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="12g" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Fiber</label><input type="text" value={recipe.nutritional_info.fiber} onChange={(e) => handleNutritionChange('fiber', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="3g" /></div>
                  <div><label className="block font-semibold text-gray-700 mb-2">Sugar</label><input type="text" value={recipe.nutritional_info.sugar} onChange={(e) => handleNutritionChange('sugar', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="8g" /></div>
                </div>
              </div>
            )}

            {/* Tips & Extras Section */}
            {activeSection === 'tips' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">💡 Tips & Additional Content</h2>
                <div><label className="block font-semibold text-gray-700 mb-2">🥬 Healthy Alternatives</label><textarea name="healthy_alternatives" value={recipe.healthy_alternatives} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Suggest healthier ingredient substitutions..." /></div>
                <div><label className="block font-semibold text-gray-700 mb-2">🍽️ Serving Suggestions</label><textarea name="serving_suggestions" value={recipe.serving_suggestions} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Recommend what to serve this dish with..." /></div>
                <div><label className="block font-semibold text-gray-700 mb-2">⚠️ Common Mistakes</label><textarea name="common_mistakes" value={recipe.common_mistakes} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Warn readers about common cooking mistakes..." /></div>
                <div><label className="block font-semibold text-gray-700 mb-2">🧊 Storage Tips</label><textarea name="storing_tips" value={recipe.storing_tips} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="How to store leftovers, freezing instructions..." /></div>
                <div><label className="block font-semibold text-gray-700 mb-2">📝 Conclusion & CTA</label><textarea name="conclusion" value={recipe.conclusion} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Wrap up with a compelling conclusion..." /></div>
              </div>
            )}

            {/* FAQs Section */}
            {activeSection === 'faqs' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">❓ Frequently Asked Questions</h2>
                  <button onClick={addFaq} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition font-medium">+ Add FAQ</button>
                </div>
                <p className="text-gray-600">FAQs help with SEO and can appear as rich snippets in Google</p>
                <div className="space-y-4">
                  {recipe.faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-700">FAQ #{index + 1}</span>
                        <button onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700" disabled={recipe.faqs.length === 1}>🗑️ Remove</button>
                      </div>
                      <input type="text" value={faq.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3" placeholder="Question?" />
                      <textarea value={faq.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Answer to the question..." />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex gap-4">
              <button onClick={() => handleSubmit(false)} disabled={saving} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 text-lg">💾 Save Draft</button>
              <button onClick={() => handleSubmit(true)} disabled={saving} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 text-lg">🚀 Publish Recipe</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
