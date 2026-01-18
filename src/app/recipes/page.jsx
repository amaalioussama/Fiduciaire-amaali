import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import RecipeCard from '@/components/RecipeCard';

async function getRecipes(searchParams) {
  const params = await searchParams;
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const url = new URL('/api/save-recipe', baseUrl);
    
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();
    
    // Filter only published recipes
    const publishedRecipes = (data.recipes || []).filter(r => r.isPublished);
    
    return { 
      recipes: publishedRecipes, 
      pagination: { page: 1, pages: 1, total: publishedRecipes.length } 
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return { recipes: [], pagination: { page: 1, pages: 1, total: 0 } };
  }
}

const CATEGORIES = [
  { name: 'All', value: '', emoji: '🍽️' },
  { name: 'Starters', value: 'Starters', emoji: '🥗' },
  { name: 'Main Dishes', value: 'Main Dishes', emoji: '🍲' },
  { name: 'Desserts', value: 'Desserts', emoji: '🍰' },
  { name: 'Salads', value: 'Salads', emoji: '🥙' },
  { name: 'Soups', value: 'Soups', emoji: '🍜' },
  { name: 'Snacks', value: 'Snacks', emoji: '🍿' },
  { name: 'Drinks', value: 'Drinks', emoji: '🍹' },
  { name: 'Breakfast', value: 'Breakfast', emoji: '🥐' },
];

export const metadata = {
  title: 'All Recipes | Fiduam',
  description: 'Discover all our delicious recipes. From starters to desserts, find inspiration for your meals.',
};

export default async function RecipesPage({ searchParams }) {
  const data = await getRecipes(searchParams);
  const params = await searchParams;
  const currentCategory = params?.category || '';
  const currentPage = parseInt(params?.page) || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-20 md:py-28 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        {/* Floating Food Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-20 left-10 text-6xl opacity-30 animate-float">🍕</span>
          <span className="absolute top-40 right-20 text-5xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>🥗</span>
          <span className="absolute bottom-20 left-1/4 text-4xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>🍰</span>
          <span className="absolute bottom-40 right-1/4 text-5xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>🍜</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              🔍 Explore our collection
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              All Our <span className="text-yellow-300">Recipes</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Discover hundreds of delicious recipes, from starters to desserts, 
              for all tastes and occasions
            </p>
            
            {/* Search Bar */}
            <form className="max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-orange-500/20 overflow-hidden">
                <svg className="absolute left-5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  name="search"
                  defaultValue={params?.search || ''}
                  placeholder="Search for a recipe, ingredient..."
                  className="flex-1 pl-14 pr-4 py-5 border-0 focus:ring-0 text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="m-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner slot="top-banner" format="horizontal" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">Filter by category</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/recipes${cat.value ? `?category=${cat.value}` : ''}`}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentCategory === cat.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:shadow-md shadow-sm border border-gray-100'
                }`}
              >
                <span className={`text-xl transition-transform duration-300 ${currentCategory !== cat.value ? 'group-hover:scale-125' : ''}`}>
                  {cat.emoji}
                </span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            <span className="font-bold text-orange-600">{data.pagination?.total || 0}</span> recipe(s) found
            {currentCategory && (
              <span className="ml-2 text-gray-500">in "{currentCategory}"</span>
            )}
          </p>
          {currentCategory && (
            <Link
              href="/recipes"
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filter
            </Link>
          )}
        </div>

        {/* Recipes Grid */}
        {data.recipes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.recipes.map((recipe, index) => (
              <div key={recipe._id}>
                <RecipeCard recipe={recipe} index={index} />
                
                {/* Insert ad after every 8 recipes */}
                {(index + 1) % 8 === 0 && index !== data.recipes.length - 1 && (
                  <div className="col-span-full mt-6 mb-6">
                    <AdBanner slot="in-feed" format="horizontal" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <span className="text-8xl mb-6 block">🔍</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or explore our categories</p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              <span>View all recipes</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {data.pagination?.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Link
                href={`/recipes?page=${currentPage - 1}${currentCategory ? `&category=${currentCategory}` : ''}`}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-orange-50 transition-all font-medium text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            )}
            
            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and pages around current
                  if (page === 1 || page === data.pagination.pages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  
                  return (
                    <div key={page} className="flex items-center gap-2">
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Link
                        href={`/recipes?page=${page}${currentCategory ? `&category=${currentCategory}` : ''}`}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-medium transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-white shadow-sm hover:shadow-md hover:bg-orange-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </Link>
                    </div>
                  );
                })}
            </div>
            
            {/* Next Button */}
            {currentPage < data.pagination.pages && (
              <Link
                href={`/recipes?page=${currentPage + 1}${currentCategory ? `&category=${currentCategory}` : ''}`}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-orange-50 transition-all font-medium text-gray-700"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner slot="bottom-banner" format="horizontal" />
      </div>
    </div>
  );
}
