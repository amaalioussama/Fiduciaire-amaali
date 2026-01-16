'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    views: 0,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (status === 'authenticated') {
      fetchRecipes();
    }
  }, [status]);

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes?all=true&limit=100');
      const data = await res.json();
      
      if (data.recipes) {
        setRecipes(data.recipes);
        
        const published = data.recipes.filter(r => r.isPublished).length;
        const totalViews = data.recipes.reduce((sum, r) => sum + (r.views || 0), 0);
        
        setStats({
          total: data.recipes.length,
          published,
          drafts: data.recipes.length - published,
          views: totalViews,
        });
      }
    } catch (err) {
      showMessage('error', 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        showMessage('success', 'Recipe deleted');
        fetchRecipes();
      } else {
        showMessage('error', 'Error deleting recipe');
      }
    } catch (err) {
      showMessage('error', 'Error deleting recipe');
    }
  };

  const togglePublish = async (recipe) => {
    try {
      const res = await fetch(`/api/recipes/${recipe._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !recipe.isPublished }),
      });
      
      if (res.ok) {
        showMessage('success', recipe.isPublished ? 'Recipe unpublished' : 'Recipe published');
        fetchRecipes();
      }
    } catch (err) {
      showMessage('error', 'Error');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍳</span>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-orange-600 transition"
              >
                View Site
              </Link>
              <span className="text-gray-600">
                Hello, {session?.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Recipes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{stats.views}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Recipes</h2>
          <Link
            href="/admin/recipes/new"
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-2"
          >
            <span>➕</span>
            New Recipe
          </Link>
        </div>

        {/* Recipes Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🍽️</span>
              <p className="text-gray-500 mb-4">No recipes yet</p>
              <Link
                href="/admin/recipes/new"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Create your first recipe →
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Recipe</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Views</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {recipe.image && recipe.image !== '/images/default-recipe.jpg' ? (
                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🍽️</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{recipe.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(recipe.createdAt).toLocaleDateString('en-US')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(recipe)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          recipe.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {recipe.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {recipe.views || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/recipes/${recipe._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          ✏️
                        </Link>
                        <Link
                          href={`/recipes/${recipe.slug}`}
                          target="_blank"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Voir"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
