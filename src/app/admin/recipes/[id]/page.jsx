'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function RecipeEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const isEditing = params.id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageType, setImageType] = useState('url'); // 'url' or 'upload'
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: '',
    isPublished: false,
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

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
        setImagePreview(data.recipe.image || '');
      }
    } catch (err) {
      showMessage('error', 'Error loading recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
    
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 5MB');
      return;
    }

    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      setRecipe(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (publish = false) => {
    if (!recipe.title.trim()) {
      showMessage('error', 'Please enter a recipe title');
      return;
    }

    setSaving(true);
    
    const recipeData = {
      title: recipe.title,
      description: recipe.description || '',
      image: recipe.image || '',
      isPublished: publish,
    };

    try {
      // Use the new simple save-recipe endpoint
      const res = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save recipe');
      }

      showMessage('success', 'Recipe saved successfully!');
      
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (err) {
      showMessage('error', err.message || 'An error occurred');
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
      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Recipe Title *
            </label>
            <input
              type="text"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Enter recipe name..."
              required
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Description
            </label>
            <textarea
              name="description"
              value={recipe.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Describe your recipe..."
            />
          </div>

          {/* Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Recipe Image
            </label>
            
            {/* Image Type Toggle */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setImageType('url')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  imageType === 'url'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔗 URL Link
              </button>
              <button
                type="button"
                onClick={() => setImageType('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  imageType === 'upload'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📁 Upload File
              </button>
            </div>

            {imageType === 'url' ? (
              <input
                type="url"
                name="image"
                value={recipe.image?.startsWith('data:') ? '' : recipe.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-5xl mb-3 block">📷</span>
                  <span className="text-gray-600">Click to upload an image</span>
                  <span className="text-gray-400 text-sm block mt-1">Max 5MB - JPG, PNG, GIF</span>
                </label>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setRecipe(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 text-lg"
            >
              💾 Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 text-lg"
            >
              🚀 Publish Recipe
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
