import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

async function getRecipe(id) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/save-recipe`, { cache: 'no-store' });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    // Find recipe by ID
    const recipe = data.recipes?.find(r => r._id === id);
    return recipe || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  
  if (!recipe) {
    return { title: 'Recipe not found' };
  }

  return {
    title: `${recipe.title} | Fiduam`,
    description: recipe.description || 'Delicious recipe from Fiduam',
  };
}

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-9xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/recipes"
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium hover:bg-white transition"
        >
          ← Back to Recipes
        </Link>
      </div>

      {/* Top Ad Banner */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdBanner slot="recipe-top" format="horizontal" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {recipe.title}
          </h1>
          
          {recipe.description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {recipe.description}
              </p>
            </div>
          )}

          {/* Middle Ad Banner */}
          <div className="my-8 py-4 border-y border-gray-100">
            <AdBanner slot="recipe-middle" format="rectangle" />
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Share this recipe 🍴
            </h3>
            <div className="flex justify-center gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://fiduam.com/recipes/${recipe._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition text-xl font-bold"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(recipe.title)}&url=https://fiduam.com/recipes/${recipe._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition text-xl"
              >
                𝕏
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=https://fiduam.com/recipes/${recipe._id}&media=${encodeURIComponent(recipe.image || '')}&description=${encodeURIComponent(recipe.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition text-xl font-bold"
              >
                P
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(recipe.title + ' - https://fiduam.com/recipes/' + recipe._id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition text-xl"
              >
                W
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <Link 
              href="/recipes"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              Discover More Recipes
            </Link>
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner slot="recipe-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
