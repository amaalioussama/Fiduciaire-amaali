
"use client";
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CallToActionPage() {
  const handleScrollToContact = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <section className="w-full bg-gray-100 py-16 flex justify-center items-center">
      <div className="max-w-2xl w-full mx-auto flex flex-col items-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] mb-4">Prêt à simplifier votre gestion financière&nbsp;?</h2>
        <p className="text-lg text-[#fbb040] mb-8">Profitez d'un accompagnement personnalisé et d'une expertise reconnue pour votre entreprise.</p>
        <Link href="/contact">
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.08, boxShadow: '0 8px 32px 0 rgba(251,176,64,0.25)' }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={handleScrollToContact}
            className="bg-[#fbb040] text-[#1e3a8a] px-8 py-4 text-lg font-bold transition border border-[#fbb040] shadow-lg rounded-none "
          >
             
            Demandez un rendez-vous gratuit
          </motion.button>
        </Link>
      </div>
    </section>
  );
} 