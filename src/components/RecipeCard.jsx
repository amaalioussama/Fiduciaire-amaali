'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RecipeCard({ recipe, index = 0 }) {
  const recipeId = recipe._id || recipe.id || 'new';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/recipes/${recipeId}`} className="group block">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {recipe.image && recipe.image.length > 0 ? (
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
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-gray-500 text-sm line-clamp-2">
                {recipe.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
            
