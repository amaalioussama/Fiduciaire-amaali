export default function RecipeSchema({ recipe }) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.image || '',
    author: {
      '@type': 'Organization',
      name: 'RecettesBlog',
    },
    datePublished: recipe.createdAt,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
    recipeYield: `${recipe.servings} portions`,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.tags?.join(', ') || '',
    recipeIngredient: recipe.ingredients?.map(
      (ing) => `${ing.quantity} ${ing.unit} ${ing.name}`
    ) || [],
    recipeInstructions: recipe.instructions?.map((inst) => ({
      '@type': 'HowToStep',
      position: inst.step,
      text: inst.description,
    })) || [],
    nutrition: recipe.nutrition ? {
      '@type': 'NutritionInformation',
      calories: recipe.nutrition.calories ? `${recipe.nutrition.calories} calories` : undefined,
      proteinContent: recipe.nutrition.protein ? `${recipe.nutrition.protein}g` : undefined,
      carbohydrateContent: recipe.nutrition.carbs ? `${recipe.nutrition.carbs}g` : undefined,
      fatContent: recipe.nutrition.fat ? `${recipe.nutrition.fat}g` : undefined,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
