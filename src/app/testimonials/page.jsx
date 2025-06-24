"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaStar, FaUserTie, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import 'swiper/css';

const testimonials = [
  {
    text: "Nous avons chargé le cabinet d'une mission comptable qui a été réalisée dans les règles de l'art et les dans les meilleurs délais",
    company: 'ARAMEX',
    gender: 'female',
    rating: 5,
    role: 'Responsable financière, ARAMEX.'
  },
  {
    text: "Fiduciaire.Com nous accompagne dans l'organisation du département comptable et financier, ses services sont de qualité et nous ont donné entière satisfaction",
    company: 'OBVISION CONSEIL',
    gender: 'male',
    rating: 5,
    role: 'Responsable chez Obvision Conseil, Rabat.'
  },
  {
    text: "Notre bureau de représentation à Casablanca est pleinement satisfait de la prestation de Fiduciaire.Com pour la mission juridique qui lui a été confiée.",
    company: 'QAPCO',
    gender: 'female',
    rating: 5,
    role: 'Responsable du bureau de représentation, QAPCO.'
  },
  {
    text: "Un accompagnement personnalisé et des conseils précieux pour la création de mon entreprise.",
    company: 'AL BARAKA',
    gender: 'male',
    rating: 4,
    role: 'Directeur administratif, AL BARAKA.'
  },
  {
    text: "Très satisfait du suivi comptable et fiscal. Les consultants sont compétents et disponibles.",
    company: 'MAROC TELECOM',
    gender: 'male',
    rating: 5,
    role: 'Chef de projet, Maroc Telecom.'
  },
  {
    text: "Merci pour votre accompagnement et votre disponibilité. Je me sens en confiance avec Amaali.",
    company: 'INWI',
    gender: 'female',
    rating: 5,
    role: 'Responsable RH, INWI.'
  },
];

const boxVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, type: 'spring' } })
};

export default function TestimonialsPage() {
  return (
    <section className="w-full py-8 md:py-16 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="max-w-6xl w-full bg-gray-50 shadow-2xl rounded-none px-4 py-12 mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1e3a8a] mb-2">Avis de nos clients</h2>
        <div className="w-16 h-1 bg-yellow-600 mx-auto mb-8" />
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 7000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div
                className="flex flex-col items-center justify-between h-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                variants={boxVariants}
              >
                {/* Bulle orange avec triangle */}
                <div className="relative w-full flex flex-col items-center">
                  <div className="bg-[#fbb040] text-white text-lg md:text-base font-medium px-6 py-6 text-center w-full rounded-none min-h-[120px] flex items-center justify-center">
                    <span>"{t.text}"</span>
                  </div>
                  <div className="w-6 h-6 bg-[#fbb040] absolute left-1/2 -translate-x-1/2 -bottom-3 rotate-45 z-10" style={{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}}></div>
                </div>
                {/* Avatar, nom, étoiles, fonction */}
                <div className="flex flex-col items-center mt-8">
                  <div className="w-16 h-16 rounded-full bg-[#1e3a8a] flex items-center justify-center mb-2">
                    {t.gender === 'male' ? (
                      <FaUserTie className="w-10 h-10 text-[#fbb040]" />
                    ) : (
                      <FaUser className="w-10 h-10 text-[#fbb040]" />
                    )}
                  </div>
                  <span className="font-bold text-[#1e3a8a] text-lg mb-1">{t.company}</span>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar key={idx} className={idx < t.rating ? 'text-[#fbb040]' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm text-center">{t.role}</span>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
} 