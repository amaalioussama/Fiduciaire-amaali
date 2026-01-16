'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: 'Starters', emoji: '🥗', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50' },
  { name: 'Main Dishes', emoji: '🍲', color: 'from-orange-400 to-red-500', bg: 'bg-orange-50' },
  { name: 'Desserts', emoji: '🍰', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50' },
  { name: 'Salads', emoji: '🥙', color: 'from-lime-400 to-green-500', bg: 'bg-lime-50' },
  { name: 'Soups', emoji: '🍜', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
  { name: 'Snacks', emoji: '🍿', color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50' },
  { name: 'Drinks', emoji: '🍹', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50' },
  { name: 'Breakfast', emoji: '🥐', color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-50' },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4"
          >
            🍴 Categories
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Explore by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find exactly what you're looking for among our different categories
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/recipes?category=${encodeURIComponent(category.name)}`}
                className={`group block ${category.bg} rounded-3xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl md:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                    {category.emoji}
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-white transition-colors duration-500 text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
