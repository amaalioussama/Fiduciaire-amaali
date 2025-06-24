import Link from 'next/link';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-12 pb-0 mt-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Notre Mission & Valeurs */}
        <div>
          <h3 className="font-bold text-lg mb-3">Notre Mission</h3>
          <p className="mb-4 text-sm opacity-80">
            Accompagner les entrepreneurs et investisseurs au Maroc avec excellence, professionnalisme et proximité. <br/>
            <span className="text-[#fbb040] font-semibold">Nos principes :</span> Expertise, Transparence, Réactivité.
          </p>
        </div>
        {/* Informations de contact */}
        <div>
          <h3 className="font-bold text-lg mb-3">Contact</h3>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <FaPhoneAlt className="text-[#fbb040]" /> 05 22 86 51 11
          </div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <FaEnvelope className="text-[#fbb040]" /> fiduciaire.fiduam@gmail.com
          </div>
          <div className="text-sm opacity-80">
            N°10, 1er Etage, Imam El Boukhari Bouargane, 80000 Agadir Maroc
          </div>
        </div>
        {/* Liens Rapides */}
        <div>
          <h3 className="font-bold text-lg mb-3">Liens Rapides</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-[#fbb040]">À propos</Link></li>
            <li><Link href="/services" className="hover:text-[#fbb040]">Nos services</Link></li>
            <li><Link href="/contact" className="hover:text-[#fbb040]">Contact</Link></li>
            <li><Link href="/about-info" className="hover:text-[#fbb040]">Notre histoire</Link></li>
          </ul>
        </div>
      </div>
      {/* Bas de page */}
      <div className="bg-[#1e3a8a] text-white text-sm flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 mt-8">
        <div>
          @ 2025 <span className="text-[#fbb040] font-bold">FiduciaireAmaali</span> Tous droits réservés.
        </div>
        <div className="flex gap-2">
          <a href="#" className="bg-[#1e3a8a] hover:bg-[#fbb040] hover:text-[#1e3a8a] p-2"><FaFacebookF /></a>
          <a href="#" className="bg-[#1e3a8a] hover:bg-[#fbb040] hover:text-[#1e3a8a] p-2"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
} 