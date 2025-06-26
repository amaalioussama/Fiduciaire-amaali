  "use client";
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaBalanceScale, FaUsers, FaCalculator, FaFileInvoiceDollar } from 'react-icons/fa';
import { useCallback } from 'react';

const services = [
  {
    icon: <FaBalanceScale className="text-4xl text-yellow-600 mb-4" />,
    title: 'Juridique',
    color: 'border-[#1e3a8a]',
    desc: "Notre équipe prend en charge toutes les démarches juridiques nécessaires à la création et au développement de votre entreprise..."
  },
  {
    icon: <FaUsers className="text-4xl text-yellow-600 mb-4" />,
    title: 'Social',
    color: 'border-yellow-600',
    desc: "Nous assurons également la gestion sociale de vos employés, en prenant en charge les déclarations et les démarches nécessaires..."
  },
  // Ajoutez d'autres services avec des icônes adaptées
];

export default function Header() {
  // Scroll animé vers la section contact
  const handleScrollToContact = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <header className="w-full">
      <div className="bg-[#1e3a8a] text-white flex flex-col sm:flex-row items-center justify-between px-4 py-2 gap-2">
        <div className="flex items-center gap-6 text-sm w-full sm:w-auto justify-center sm:justify-start">
          <span className="flex items-center gap-2"><FaPhoneAlt />  +212 5 28 22 04 03</span>
          <span className="flex items-center gap-2"><FaMapMarkerAlt /> Fiduam - N°10, 1er Etage, Imam El Boukhari Bouargane, 80000 Agadir Maroc </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
          <button
            onClick={handleScrollToContact}
            className="bg-white text-[#1e3a8a] px-4 py-2 font-semibold border border-[#1e3a8a] transition flex items-center gap-2 shadow-lg rounded-none hover:scale-105 hover:shadow-2xl active:scale-95 duration-300"
          >
            <span className="text-lg">📅</span> Réservez un devis  !
          </button>
          <a href="#" className="text-white hover:text-yellow-600"><FaFacebookF /></a>
          <a href="#" className="text-white hover:text-yellow-600"><FaInstagram /></a>
          <a href="#" className="text-white hover:text-yellow-600"><FaLinkedinIn /></a>
        </div>
      </div>
    </header>
  );
}