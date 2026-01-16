'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RecipeCard({ recipe, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/recipes/${recipe.slug}`} className="group block">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {recipe.image && recipe.image !== '/images/default-recipe.jpg' ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <span className="text-7xl">🍽️</span>
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-orange-600 rounded-full text-sm font-bold shadow-lg">
                {recipe.category}
              </span>
            </div>

            {/* Featured Badge */}
            {recipe.isFeatured && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  ⭐ Featured
                </span>
              </div>
            )}

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recipe.prepTime + recipe.cookTime} min
                </span>
              </div>
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                👥 {recipe.servings}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {recipe.description}
            </p>
            
            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                recipe.difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-700'
                  : recipe.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {recipe.difficulty}
              </div>
              <span className="text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View recipe
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
