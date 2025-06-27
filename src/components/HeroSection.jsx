"use client";
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGoogleAnalytics from "../hooks/useGoogleAnalytics";

const typewriterWords = [
  'Fiduam',
  'Votre',
  'partenaire',
  'fiduciaire',
  'et',
  'comptable',
  'de',
  'confiance',
  'à',
  'Agadir'
];

function useTypewriterWords(words, speed = 350) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
    if (!words || words.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < words.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, speed);
    return () => clearInterval(interval);
  }, [words, speed]);
  return words.slice(0, index).join(' ');
}

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.7, type: 'spring' }
};

export default function HeroSection() {
  const typedTitle = useTypewriterWords(typewriterWords, 350);

  // Scroll animé vers une section par id
  const handleScrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <motion.section {...sectionAnim} className="w-full relative min-h-[520px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image 
          src="/hero.png" 
          alt="Fiduam - Cabinet Fiduciaire et Comptable à Agadir - Services juridiques et comptables" 
          fill 
          className="object-cover w-full h-full" 
          priority 
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Texte au-dessus du background */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20 flex flex-col md:items-start items-center">
        <span className="uppercase text-base font-bold text-[#bfa046] bg-[#f6f1e7]/80 px-4 py-2 mb-5 tracking-wider shadow">Cabinet Fiduciaire Agadir</span>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg leading-tight text-center md:text-left">
          {typedTitle}
          <span className="inline-block w-2 h-8 bg-[#fbb046] align-middle animate-pulse ml-1" style={{verticalAlign:'middle'}}></span>
        </h1>
        <p className="text-[#fbbf24] text-2xl md:text-3xl mb-6 drop-shadow-lg font-semibold text-center md:text-left">
          Cabinet fiduciaire et comptable à Agadir - Services juridiques, comptables et sociaux pour entreprises
        </p>
        <div className="w-24 h-1 bg-[#bfa046] mb-8" />
        <ul className="mb-8 space-y-4">
          <li className="flex items-center gap-3 text-lg md:text-xl text-white font-medium drop-shadow"><FaCheckCircle className="text-[#bfa046] text-2xl" /> Optimisation de Votre Comptabilité</li>
          <li className="flex items-center gap-3 text-lg md:text-xl text-white font-medium drop-shadow"><FaCheckCircle className="text-[#bfa046] text-2xl" /> Conformité Fiscale Assurée</li>
          <li className="flex items-center gap-3 text-lg md:text-xl text-white font-medium drop-shadow"><FaCheckCircle className="text-[#bfa046] text-2xl" /> Suivi et Accessibilité Digitalisés</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          <button
            onClick={() => handleScrollTo('contact')}
            className="bg-[#1e3a8a] text-white px-8 py-4 text-lg font-bold transition border border-[#1e3a8a] w-full sm:w-auto shadow-lg rounded-none hover:scale-105 hover:shadow-2xl active:scale-95 duration-300 animate-fade-in-up"
          >
        Demander un devis
          </button>
          <button
            onClick={() => handleScrollTo('services')}
            className="bg-[#bfa046] text-white px-8 py-4 text-lg font-bold transition border border-[#bfa046] w-full sm:w-auto shadow-lg rounded-none hover:scale-105 hover:shadow-2xl active:scale-95 duration-300 animate-fade-in-up"
          >
            Services Fiduciaire et Comptable
          </button>
        </div>
      </div>
    </motion.section>
  );
} 