"use client";
import { FaBookOpen, FaCalculator, FaMoneyCheckAlt, FaFileInvoiceDollar, FaGavel, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <FaGavel className="text-4xl text-[#1e3a8a] mb-4" />,
    title: 'Juridique',
    color: 'border-[#1e3a8a]',
    desc: "notre équipe  prend en charge toutes les démarches juridiques nécessaires à la création et au développement de votre entreprise. Nous nous occupons de la rédaction des statuts, de l'obtention du certificat négatif, de l'accomplissement des formalités auprès du greffe, ainsi que de la publication dans un journal d'annonces légales. Nous préparons également les procès-verbaux des assemblées générales ordinaires ou extraordinaires et assurons la tenue des registres légaux."
  },
  {
    icon: <FaBookOpen className="text-4xl text-yellow-600 mb-4" />,
    title: 'Gestion de la Comptabilité',
    color: 'border-yellow-600',
    desc: "Nous gérons votre comptabilité en conformité avec les normes marocaines. Nous automatisons la tenue des livres, la préparation des bilans et des déclarations fiscales. Vous accédez à vos données en temps réel, facilitant ainsi une gestion plus rapide et efficace. Nos solutions réduisent les erreurs et garantissent une conformité fiscale continue. Vous bénéficiez d'une gestion optimisée, vous permettant de mieux suivre la santé financière de votre entreprise. "
  },
  {
    icon: <FaCalculator className="text-4xl text-[#1e3a8a] mb-4" />,
    title: 'Fiscalité',
    color: 'border-[#1e3a8a]',
    desc: "Nos services fiscaux comprennent la préparation de toutes les déclarations fiscales pour les sociétés, les entreprises individuelles et les particuliers. Nous proposons également une assistance personnalisée en cas de contrôle fiscal, assurant ainsi une défense solide de vos intérêts. De plus, nous gérons efficacement la télédéclaration de vos déclarations fiscales, vous offrant ainsi un service complet."
  },
  {
    icon: <FaHandshake className="text-4xl text-yellow-600 mb-4" />,
    title: 'Social',
    color: 'border-yellow-600',
    desc: "Nous assurons également la gestion sociale de vos employés, en prenant en charge les déclarations et les démarches nécessaires pour respecter les obligations légales. Nous veillons à la conformité des cotisations sociales, des assurances, ainsi que des contributions diverses. Nous vous conseillons également sur les meilleures pratiques en matière de gestion du personnel et d'optimisation des coûts sociaux"
  },
  {
    icon: <FaFileInvoiceDollar className="text-4xl text-[#1e3a8a] mb-4" />,
    title: 'Digitalisation de la Facturation',
    color: 'border-[#1e3a8a]',
    desc: "Simplifiez et digitalisez votre processus de facturation avec notre service. Nous vous aidons à générer des factures conformes à la réglementation, à suivre vos paiements, et à gérer les relances. Vous gagnerez en efficacité et pourrez vous concentrer sur la croissance de votre entreprise."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className={`bg-white shadow-xl rounded-none p-8 flex flex-col items-center text-center border-t-4 ${s.color} transition duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                i === 4 ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''
              }`}
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