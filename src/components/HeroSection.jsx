'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-[200px] rotate-12">🍕</div>
        <div className="absolute top-40 right-10 text-[150px] -rotate-12">🥘</div>
        <div className="absolute bottom-20 left-1/4 text-[180px] rotate-6">🍰</div>
        <div className="absolute bottom-10 right-1/4 text-[120px] -rotate-6">🥗</div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="animate-pulse">🔥</span>
              <span>+500 Delicious Recipes</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Cook with
              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Passion
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Discover hundreds of easy and delicious recipes to delight your loved ones. 
              From breakfast to dinner, find your inspiration!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/recipes"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
              >
                <span>Explore Recipes</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/recipes?category=Main%20Dishes"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300"
              >
                <span>🍽️</span>
                <span>Today's Specials</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-500">500+</p>
                <p className="text-gray-500 text-sm">Recipes</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-red-500">8</p>
                <p className="text-gray-500 text-sm">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-pink-500">100%</p>
                <p className="text-gray-500 text-sm">Free</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Image Circle */}
              <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full" />
                <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl bg-white flex items-center justify-center">
                  <span className="text-[180px]">🍳</span>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-20 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🥗</div>
                <div>
                  <p className="font-semibold text-gray-800">Salads</p>
                  <p className="text-sm text-gray-500">Fresh</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-4 top-32 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">🍰</div>
                <div>
                  <p className="font-semibold text-gray-800">Desserts</p>
                  <p className="text-sm text-gray-500">Sweet</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute left-10 bottom-10 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">🍲</div>
                <div>
                  <p className="font-semibold text-gray-800">Main Dishes</p>
                  <p className="text-sm text-gray-500">Traditional</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-orange-500 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}