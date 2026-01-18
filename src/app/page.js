import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import RecipeSwiper from '@/components/RecipeSwiper';
import CategoriesSection from '@/components/CategoriesSection';
import RecipeCard from '@/components/RecipeCard';
import AdBanner from '@/components/AdBanner';

async function getFeaturedRecipes() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/save-recipe`, { cache: 'no-store' });
    const data = await res.json();
    const published = (data.recipes || []).filter(r => r.isPublished);
    return published.slice(0, 8);
  } catch (error) {
    return [];
  }
}

async function getLatestRecipes() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/save-recipe`, { cache: 'no-store' });
    const data = await res.json();
    const published = (data.recipes || []).filter(r => r.isPublished);
    return published.slice(0, 8);
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const featuredRecipes = await getFeaturedRecipes();
  const latestRecipes = await getLatestRecipes();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner slot="home-top" format="horizontal" />
      </div>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Recipes Swiper */}
      {featuredRecipes.length > 0 && (
        <RecipeSwiper 
          recipes={featuredRecipes}
          title="⭐ Featured Recipes"
          subtitle="Our best recipes selected just for you"
        />
      )}

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner slot="home-middle" format="horizontal" />
      </div>

      {/* Latest Recipes Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
              🆕 New Arrivals
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Recipes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most recently added recipes to our collection
            </p>
          </div>
          
          {latestRecipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestRecipes.map((recipe, index) => (
                  <RecipeCard key={recipe._id} recipe={recipe} index={index} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/recipes"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
                >
                  <span>Discover More Recipes</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <span className="text-8xl mb-6 block">🍳</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No recipes available</h3>
              <p className="text-gray-600 mb-6">Start by adding your first recipe!</p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <span>Go to Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-6xl mb-6 block">📧</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get our best recipes
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and receive new delicious recipes every week!
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-4 focus:ring-white/30 shadow-lg"
              required
            />
            <button
              type="submit"
              className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner slot="home-bottom" format="horizontal" />
      </div>
    </div>
  );
}
