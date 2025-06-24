"use client";
import { FaBookOpen, FaCalculator, FaMoneyCheckAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <FaBookOpen className="text-4xl text-[#1e3a8a] mb-4" />,
    title: 'Gestion de la Comptabilité',
    color: 'border-[#1e3a8a]',
    desc: "Nous vous accompagnons dans la gestion quotidienne de votre comptabilité, en assurant une conformité totale avec les normes comptables marocaines et internationales. Nos services incluent la tenue des livres comptables, la préparation des bilans, ainsi que les déclarations fiscales."
  },
  {
    icon: <FaCalculator className="text-4xl text-yellow-600 mb-4" />,
    title: 'Fiscalité',
    color: 'border-yellow-600',
    desc: "Optimisez votre fiscalité avec l'aide de nos experts. Nous vous proposons des conseils personnalisés pour réduire vos impôts et assurer votre conformité aux obligations fiscales marocaines. Nous couvrons la déclaration de la TVA, l'impôt sur les sociétés, et d'autres aspects fiscaux complexes."
  },
  {
    icon: <FaMoneyCheckAlt className="text-4xl text-[#1e3a8a] mb-4" />,
    title: 'Gestion de la Paie',
    color: 'border-[#1e3a8a]',
    desc: "La gestion de la paie est cruciale pour le bon fonctionnement de votre entreprise. Nous prenons en charge la préparation des fiches de paie, la gestion des cotisations sociales, et la conformité avec la législation du travail au Maroc."
  },
  {
    icon: <FaFileInvoiceDollar className="text-4xl text-yellow-600 mb-4" />,
    title: 'Facturation',
    color: 'border-yellow-600',
    desc: "Simplifiez votre processus de facturation avec notre service. Nous vous aidons à générer des factures conformes à la réglementation, à suivre vos paiements, et à gérer les relances. Vous gagnerez en efficacité et pourrez vous concentrer sur la croissance de votre entreprise."
  },
];

const boxVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, type: 'spring' } })
};

export default function ServicesPage() {
  return (
    <section className="w-full py-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1e3a8a] mb-2">Nos Services</h2>
        <div className="w-16 h-1 bg-yellow-600 mx-auto mb-6" />
        <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          Nous proposons une gamme complète de services comptables et financiers pour aider votre entreprise à prospérer, avec une approche personnalisée et professionnelle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className={`bg-white shadow-xl rounded-none p-8 flex flex-col items-center text-center border-t-4 ${s.color} transition duration-300 hover:shadow-2xl hover:-translate-y-2`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={boxVariants}
            >
              {s.icon}
              <h3 className={`text-xl font-bold mb-2 ${s.color.replace('border-', 'text-')}`}>{s.title}</h3>
              <p className="text-gray-700">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 