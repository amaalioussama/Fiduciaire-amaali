import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';
import RecipeSchema from '@/components/RecipeSchema';

async function getRecipe(slug) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/recipes/${slug}`, { cache: 'no-store' });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.recipe;
  } catch (error) {
    return null;
  }
}

async function getRelatedRecipes(category, currentId) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/recipes?category=${category}&limit=4`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.recipes?.filter(r => r._id !== currentId).slice(0, 3) || [];
  } catch (error) {
    return [];
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
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.image ? [recipe.image] : [],
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = await getRelatedRecipes(recipe.category, recipe._id);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Schema for SEO */}
      <RecipeSchema recipe={recipe} />
      
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] bg-orange-100">
        {recipe.image && recipe.image !== '/images/default-recipe.jpg' ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-9xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back button */}
        <Link
          href="/recipes"
          className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-gray-700 hover:bg-white transition flex items-center gap-2 shadow-lg"
        >
          ← Back to recipes
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Recipe Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Title Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {recipe.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {recipe.difficulty}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {recipe.cuisine}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {recipe.title}
            </h1>
            
            <p className="text-gray-600 text-lg">
              {recipe.description}
            </p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <span className="text-2xl mb-1 block">⏱️</span>
                <p className="text-sm text-gray-500">Prep Time</p>
                <p className="font-semibold text-gray-800">{recipe.prepTime} min</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <span className="text-2xl mb-1 block">🔥</span>
                <p className="text-sm text-gray-500">Cook Time</p>
                <p className="font-semibold text-gray-800">{recipe.cookTime} min</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <span className="text-2xl mb-1 block">⏰</span>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold text-gray-800">{totalTime} min</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <span className="text-2xl mb-1 block">👥</span>
                <p className="text-sm text-gray-500">Servings</p>
                <p className="font-semibold text-gray-800">{recipe.servings}</p>
              </div>
            </div>
          </div>

          {/* Ad Banner */}
          <div className="px-6 md:px-8 py-4 bg-gray-50">
            <AdBanner slot="recipe-top" format="horizontal" />
          </div>

          {/* Ingredients */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>🥗</span> Ingredients
            </h2>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients?.map((ing, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition"
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-800">
                    <strong className="text-orange-600">
                      {ing.quantity} {ing.unit}
                    </strong>{' '}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>👨‍🍳</span> Instructions
            </h2>
            
            <ol className="space-y-6">
              {recipe.instructions?.map((inst, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{inst.step}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-gray-700 leading-relaxed">
                      {inst.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Ad Banner */}
          <div className="px-6 md:px-8 py-4 bg-gray-50">
            <AdBanner slot="recipe-middle" format="rectangle" />
          </div>

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="p-6 md:p-8 bg-orange-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Share this recipe 🍴
            </h2>
            <div className="flex justify-center gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(recipe.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
              >
                𝕏
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&media=${encodeURIComponent(recipe.image || '')}&description=${encodeURIComponent(recipe.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition"
              >
                P
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(recipe.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition"
              >
                W
              </a>
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Similar Recipes 🍳
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedRecipes.map((related) => (
                <Link
                  key={related._id}
                  href={`/recipes/${related.slug}`}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-video overflow-hidden bg-orange-100">
                    {related.image && related.image !== '/images/default-recipe.jpg' ? (
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {related.prepTime + related.cookTime} min • {related.difficulty}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="mb-12">
          <AdBanner slot="recipe-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
