'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RecipeSwiper({ recipes, title, subtitle }) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {title || 'Our Recipes'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {subtitle || 'Discover our best recipes'}
          </motion.p>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="recipe-swiper !pb-14"
        >
          {recipes.map((recipe) => (
            <SwiperSlide key={recipe._id}>
              <Link href={`/recipes/${recipe.slug}`} className="block group">
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
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-sm font-semibold shadow-lg">
                        {recipe.category}
                      </span>
                    </div>

                    {/* Time Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {recipe.description}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <span>👥</span>
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recipe.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-700'
                          : recipe.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {recipe.difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
          >
            <span>View All Recipes</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .recipe-swiper .swiper-button-prev,
        .recipe-swiper .swiper-button-next {
          background: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .recipe-swiper .swiper-button-prev:after,
        .recipe-swiper .swiper-button-next:after {
          font-size: 18px;
          font-weight: bold;
          color: #ea580c;
        }
        .recipe-swiper .swiper-button-prev:hover,
        .recipe-swiper .swiper-button-next:hover {
          background: linear-gradient(to right, #f97316, #ef4444);
        }
        .recipe-swiper .swiper-button-prev:hover:after,
        .recipe-swiper .swiper-button-next:hover:after {
          color: white;
        }
        .recipe-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
        }
        .recipe-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(to right, #f97316, #ef4444);
          width: 24px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
}
