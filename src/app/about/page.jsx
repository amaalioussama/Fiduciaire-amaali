"use client"
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <section className="w-full min-h-[480px] flex flex-col md:flex-row items-center justify-center bg-[#1e3a8a] relative overflow-hidden py-12 px-4">
      {/* Image à gauche */}
      <div className="flex-1 flex items-center justify-center mb-8 md:mb-0">
        <div className="rounded-none overflow-hidden shadow-2xl bg-white p-2">
          <Image src="/elevate.png" alt="Fiduciaire Amaali" width={400} height={300} className="object-contain w-full h-auto" />
        </div>
      </div>
      {/* Texte à droite */}
      <div className="flex-1 flex flex-col justify-center items-start md:pl-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4"><span className="text-yellow-600">25 ans</span> d'expertise au service des investisseurs au Maroc</h2>
        <p className="text-lg text-white mb-6 max-w-xl">
          La fiduciaire <span className="font-bold text-yellow-600">AMAALI SARL</span> est une société fiduciaire ainsi qu'un cabinet de conseil et de formation, spécialisé dans la coordination et l'accompagnement d'investisseurs potentiels souhaitant s'implanter au Maroc.<br/><br/>
          Fondée en 2000 par son gérant, <span className="font-bold text-yellow-600">M. AMAALI ABDESLAM</span>, notre équipe accompagne depuis plus de 20 ans des entrepreneurs et entreprises dans toutes leurs démarches administratives, fiscales et stratégiques, avec un engagement fort pour l'excellence, la proximité et la réussite de vos projets.
        </p>
        <Link href="/about-info">
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.08, boxShadow: '0 8px 32px 0 rgba(251,176,64,0.25)' }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-yellow-600 text-white px-8 py-3 font-bold transition border border-yellow-600 shadow-lg rounded-none"
          >
            En savoir plus
          </motion.button>
        </Link>
      </div>
    </section>
  );
} 