import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

// Fake user names for comments
const FAKE_USERS = [
  { name: 'Emma Johnson', avatar: '👩‍🍳' },
  { name: 'Michael Brown', avatar: '👨‍🍳' },
  { name: 'Sarah Williams', avatar: '👩' },
  { name: 'James Davis', avatar: '👨' },
  { name: 'Olivia Martinez', avatar: '👩‍🦰' },
  { name: 'William Anderson', avatar: '👴' },
  { name: 'Sophia Taylor', avatar: '👱‍♀️' },
  { name: 'Benjamin Wilson', avatar: '🧔' },
  { name: 'Isabella Thomas', avatar: '👩‍🦱' },
  { name: 'Lucas Garcia', avatar: '👨‍🦱' },
  { name: 'Mia Rodriguez', avatar: '👧' },
  { name: 'Ethan Lee', avatar: '🧑' },
  { name: 'Charlotte Clark', avatar: '👩‍🦳' },
  { name: 'Alexander White', avatar: '👨‍🦳' },
  { name: 'Amelia Harris', avatar: '💁‍♀️' },
];

// Fake comments
const FAKE_COMMENTS = [
  "Absolutely delicious! My family loved it.",
  "Made this for dinner last night. Will definitely make again!",
  "Perfect recipe! Easy to follow and tastes amazing.",
  "This has become a household favorite. Thank you!",
  "Turned out even better than expected. Highly recommend!",
  "Simple yet so flavorful. Great recipe!",
  "My kids asked for seconds! That says it all.",
  "Restaurant quality at home. Impressive!",
  "The best recipe I've found online. Keeper!",
  "Made it twice this week already. So good!",
  "Easy to make and absolutely delicious!",
  "This recipe never disappoints. Always perfect!",
  "Wow! Just wow! Amazing flavors!",
  "Comfort food at its finest. Love it!",
  "A new family tradition. Thank you for sharing!",
];

// Generate random rating between 4 and 5
function generateRating(seed) {
  const random = Math.sin(seed) * 10000;
  const base = 4 + (Math.abs(random) % 10) / 10;
  return Math.min(5, Math.max(4, Math.round(base * 2) / 2));
}

// Generate random comments for a recipe
function generateComments(recipeId) {
  const seed = recipeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const numComments = 3 + (seed % 3); // 3-5 comments
  const comments = [];
  
  for (let i = 0; i < numComments; i++) {
    const userIndex = (seed + i * 7) % FAKE_USERS.length;
    const commentIndex = (seed + i * 11) % FAKE_COMMENTS.length;
    const rating = 4 + ((seed + i) % 2); // 4 or 5 stars
    const daysAgo = 1 + ((seed + i * 3) % 30);
    
    comments.push({
      user: FAKE_USERS[userIndex],
      comment: FAKE_COMMENTS[commentIndex],
      rating,
      date: `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`,
    });
  }
  
  return comments;
}

// Star rating component
function StarRating({ rating, size = 'md' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const sizeClass = size === 'lg' ? 'text-2xl' : 'text-lg';
  
  return (
    <span className={`${sizeClass} flex items-center gap-0.5`}>
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>⭐</span>)}
      {hasHalf && <span>⭐</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="opacity-30">⭐</span>)}
    </span>
  );
}

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
    description: recipe.meta_description || recipe.description || 'Delicious recipe from Fiduam',
    keywords: recipe.nlp_keywords?.join(', ') || recipe.focus_keyword || '',
  };
}

// Helper to format time
function formatTime(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  // Generate rating and comments based on recipe ID
  const recipeId = recipe._id || slug;
  const rating = generateRating(recipeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const comments = generateComments(recipeId);
  const reviewCount = 50 + (recipeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 150);

  // Recipe JSON-LD Schema for SEO
  const recipeSchema = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipe.title,
    "description": recipe.meta_description || recipe.description,
    "image": recipe.image ? [recipe.image] : [],
    "author": { "@type": "Organization", "name": "Fiduam" },
    "datePublished": recipe.createdAt,
    "prepTime": recipe.preparation_time ? `PT${recipe.preparation_time}M` : undefined,
    "cookTime": recipe.cooking_time ? `PT${recipe.cooking_time}M` : undefined,
    "totalTime": recipe.total_time ? `PT${recipe.total_time}M` : undefined,
    "recipeYield": recipe.servings ? `${recipe.servings} servings` : undefined,
    "recipeIngredient": recipe.ingredients?.map(i => `${i.amount || ''} ${i.unit || ''} ${i.name}`.trim()),
    "recipeInstructions": recipe.steps?.map(s => ({
      "@type": "HowToStep",
      "text": s.instruction
    })),
    "nutrition": recipe.nutritional_info?.calories ? {
      "@type": "NutritionInformation",
      "calories": `${recipe.nutritional_info.calories} calories`
    } : undefined,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount
    },
    "keywords": recipe.focus_keyword
  };

  // FAQ Schema
  const faqSchema = recipe.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": recipe.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-9xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Link href="/recipes" className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium hover:bg-white transition">
          ← Back to Recipes
        </Link>
      </div>

      {/* Top Ad Banner */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdBanner slot="recipe-top" format="horizontal" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <article className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          
          {/* Rating & Title */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={rating} size="lg" />
            <span className="text-2xl font-bold text-gray-800">{rating.toFixed(1)}</span>
            <span className="text-gray-500">({reviewCount} reviews)</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{recipe.title}</h1>
          
          {/* Time & Servings Info Box */}
          {(recipe.preparation_time || recipe.cooking_time || recipe.servings) && (
            <div className="flex flex-wrap gap-6 bg-orange-50 rounded-2xl p-6 mb-8">
              {recipe.preparation_time > 0 && (
                <div className="text-center">
                  <span className="text-3xl block mb-1">⏱️</span>
                  <span className="text-sm text-gray-600">Prep Time</span>
                  <p className="font-bold text-gray-800">{formatTime(recipe.preparation_time)}</p>
                </div>
              )}
              {recipe.cooking_time > 0 && (
                <div className="text-center">
                  <span className="text-3xl block mb-1">🍳</span>
                  <span className="text-sm text-gray-600">Cook Time</span>
                  <p className="font-bold text-gray-800">{formatTime(recipe.cooking_time)}</p>
                </div>
              )}
              {recipe.total_time > 0 && (
                <div className="text-center">
                  <span className="text-3xl block mb-1">⏰</span>
                  <span className="text-sm text-gray-600">Total Time</span>
                  <p className="font-bold text-gray-800">{formatTime(recipe.total_time)}</p>
                </div>
              )}
              {recipe.servings > 0 && (
                <div className="text-center">
                  <span className="text-3xl block mb-1">👥</span>
                  <span className="text-sm text-gray-600">Servings</span>
                  <p className="font-bold text-gray-800">{recipe.servings}</p>
                </div>
              )}
            </div>
          )}

          {/* Introduction */}
          {recipe.introduction && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{recipe.introduction}</p>
            </div>
          )}

          {/* Short Description (if no introduction) */}
          {!recipe.introduction && recipe.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{recipe.description}</p>
            </div>
          )}

          {/* Ingredients Section */}
          {recipe.ingredients?.length > 0 && recipe.ingredients[0]?.name && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🥗</span> Ingredients
              </h2>
              <div className="bg-green-50 rounded-2xl p-6">
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
                      <span className="text-gray-800">
                        {ing.amount && <strong>{ing.amount} </strong>}
                        {ing.unit && <span>{ing.unit} </span>}
                        {ing.name}
                        {ing.notes && <span className="text-gray-500 text-sm ml-2">({ing.notes})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Middle Ad */}
          <div className="my-8 py-4 border-y border-gray-100">
            <AdBanner slot="recipe-middle" format="rectangle" />
          </div>

          {/* Steps Section */}
          {recipe.steps?.length > 0 && recipe.steps[0]?.instruction && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>👨‍🍳</span> Instructions
              </h2>
              <div className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <span className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">{step.instruction}</p>
                      {step.tip && (
                        <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <p className="text-sm text-yellow-800">💡 <strong>Pro Tip:</strong> {step.tip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Information */}
          {recipe.nutritional_info?.calories && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🍎</span> Nutrition Facts
              </h2>
              <p className="text-sm text-gray-500 mb-4">Per serving</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {recipe.nutritional_info.calories && (
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{recipe.nutritional_info.calories}</p>
                    <p className="text-sm text-gray-600">Calories</p>
                  </div>
                )}
                {recipe.nutritional_info.protein && (
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{recipe.nutritional_info.protein}</p>
                    <p className="text-sm text-gray-600">Protein</p>
                  </div>
                )}
                {recipe.nutritional_info.carbs && (
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{recipe.nutritional_info.carbs}</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                  </div>
                )}
                {recipe.nutritional_info.fat && (
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{recipe.nutritional_info.fat}</p>
                    <p className="text-sm text-gray-600">Fat</p>
                  </div>
                )}
                {recipe.nutritional_info.fiber && (
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{recipe.nutritional_info.fiber}</p>
                    <p className="text-sm text-gray-600">Fiber</p>
                  </div>
                )}
                {recipe.nutritional_info.sugar && (
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-pink-600">{recipe.nutritional_info.sugar}</p>
                    <p className="text-sm text-gray-600">Sugar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Healthy Alternatives */}
          {recipe.healthy_alternatives && (
            <div className="mb-10 bg-green-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🥬</span> Healthy Alternatives
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.healthy_alternatives}</p>
            </div>
          )}

          {/* Serving Suggestions */}
          {recipe.serving_suggestions && (
            <div className="mb-10 bg-blue-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🍽️</span> Serving Suggestions
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.serving_suggestions}</p>
            </div>
          )}

          {/* Common Mistakes */}
          {recipe.common_mistakes && (
            <div className="mb-10 bg-red-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>⚠️</span> Common Mistakes to Avoid
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.common_mistakes}</p>
            </div>
          )}

          {/* Storage Tips */}
          {recipe.storing_tips && (
            <div className="mb-10 bg-purple-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🧊</span> Storage Tips
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.storing_tips}</p>
            </div>
          )}

          {/* Conclusion */}
          {recipe.conclusion && (
            <div className="mb-10 bg-orange-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📝</span> Final Thoughts
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.conclusion}</p>
            </div>
          )}

          {/* FAQs Section */}
          {recipe.faqs?.length > 0 && recipe.faqs[0]?.question && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>❓</span> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {recipe.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4">
                      <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>💬</span> User Reviews
            </h3>
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{comment.user.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <div className="mb-2"><StarRating rating={comment.rating} size="sm" /></div>
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Share this recipe 🍴</h3>
            <div className="flex justify-center gap-4">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://fiduam.com/recipes/${recipe._id}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition text-xl font-bold">f</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(recipe.title)}&url=https://fiduam.com/recipes/${recipe._id}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition text-xl">𝕏</a>
              <a href={`https://pinterest.com/pin/create/button/?url=https://fiduam.com/recipes/${recipe._id}&media=${encodeURIComponent(recipe.image || '')}&description=${encodeURIComponent(recipe.title)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition text-xl font-bold">P</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(recipe.title + ' - https://fiduam.com/recipes/' + recipe._id)}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition text-xl">W</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <Link href="/recipes" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
              Discover More Recipes
            </Link>
          </div>
        </article>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner slot="recipe-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
