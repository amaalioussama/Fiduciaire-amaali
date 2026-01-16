async function getRecipes() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/recipes?limit=1000`, { cache: 'no-store' });
    const data = await res.json();
    return data.recipes || [];
  } catch (error) {
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://fiduam.com';
  const recipes = await getRecipes();
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Category pages
  const categories = [
    'Starters',
    'Main Dishes',
    'Desserts',
    'Salads',
    'Soups',
    'Snacks',
    'Drinks',
    'Breakfast',
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/recipes?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Recipe pages
  const recipePages = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.slug}`,
    lastModified: new Date(recipe.updatedAt || recipe.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...recipePages];
} 