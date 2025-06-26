"use client";
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = formRef.current;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const message = form.message.value;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi.');
      toast.success('Votre message a bien été envoyé !');
      form.reset();
    } catch (err) {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-right" />
      {/* Google Maps à gauche */}
      <div className="md:w-1/2 w-full h-[350px] md:h-auto">
       <iframe
          title="Fiduam Localisation"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.4982119176234!2d-9.5603762!3d30.4219756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b77261da9803%3A0x31f8892834cae55f!2sFiduciaire%20Amaali%20(Fiduam)!5e0!3m2!1sfr!2sma!4v1750780796759!5m2!1sfr!2sma"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      {/* Formulaire à droite */}
      <div className="md:w-1/2 w-full bg-[#1e3a8a] flex flex-col justify-center items-center py-12 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Réservez un devis</h2>
        <p className="text-white mb-8">Entrez simplement vos informations, c'est 100% gratuit et sans engagement.</p>
        <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
          <input type="text" name="name" required placeholder="Nom complet*" className="px-4 py-3 rounded-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fbb040] text-white placeholder-gray-300" />
          <input type="email" name="email" required placeholder="Votre email*" className="px-4 py-3 rounded-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fbb040] text-white placeholder-gray-300" />
          <input type="tel" name="phone" placeholder="Numéro de téléphone" className="px-4 py-3 rounded-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fbb040] text-white placeholder-gray-300" />
          <textarea name="message" rows={5} required placeholder="Votre message*" className="px-4 py-3 rounded-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fbb040] text-white placeholder-gray-300" />
          <button type="submit" disabled={loading} className="bg-[#fbb040] text-[#1e3a8a] px-8 py-4 text-lg font-bold transition border border-[#1e3a8a] w-full sm:w-auto shadow-lg disabled:opacity-60">
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
        <div className="text-white text-sm mt-8 opacity-70">Fiduam - N°10, 1er Etage, Imam El Boukhari Bouargane, 80000 Agadir Maroc</div>
      </div>
    </section>
  );
}  