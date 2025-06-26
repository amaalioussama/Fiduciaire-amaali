"use client"
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaBuilding, FaUserTie, FaSmile } from 'react-icons/fa';

function Counter({ to, duration = 1500, className }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const observerRef = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          setCount(0);
          const end = parseInt(to);
          if (start === end) return;
          let totalMilSecDur = parseInt(duration);
          let incrementTime = Math.abs(Math.floor(totalMilSecDur / end));
          let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
          }, incrementTime);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    observerRef.current = observer;
    return () => {
      if (observerRef.current && node) observerRef.current.unobserve(node);
    };
  }, [to, duration]);

  return <span ref={ref} className={className}>{count}</span>;
}

export default function AboutInfoPage() {
  return (
    <section id="about" className="w-full min-h-screen bg-[#f4f7fa] py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 mb-16">
        {/* Image à gauche */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white p-2 shadow-2xl rounded-none">
            <Image src="/elevate.png" alt="Fiduciaire Amaali" width={400} height={300} className="object-contain w-full h-auto" />
          </div>
        </div>
        {/* Texte à droite */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] mb-4"><span className="text-yellow-600">25 ans</span> d'expérience au service de nos clients</h2>
          <p className="text-lg text-gray-800 mb-6">
            Animée par la volonté de capitaliser une longue expérience probante et riche dans le domaine du Conseil et du Management, la fiduciaire <span className="font-bold text-[#1e3a8a]">AMAALI SARL</span> a été fondée en 2000 par <span className="font-bold text-[#1e3a8a]">M. AMAALI ABDESLAM</span> pour offrir un large panel de services pluridisciplinaires aux investisseurs souhaitant s'implanter au Maroc.<br/><br/>
            Nos services sont basés sur le respect de trois principes fondamentaux : <span className="font-bold text-yellow-600">Excellence</span>, <span className="font-bold text-yellow-600">Professionnalisme</span> & <span className="font-bold text-yellow-600">Proximité</span>.<br/><br/>
            Nos équipes visent l'excellence et ont à cœur de vous offrir un service de qualité pour une satisfaction optimale.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full mb-8">
            <div className="flex flex-col items-center flex-1">
              <FaBuilding className="text-3xl md:text-4xl text-yellow-600 mb-1" />
              <Counter to={350} duration={1200} className="text-4xl font-extrabold text-yellow-600" />
              <span className="text-[#1e3a8a] font-semibold text-center">Entreprises accompagnées</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <FaUserTie className="text-3xl md:text-4xl text-yellow-600 mb-1" />
              <Counter to={10} duration={1200} className="text-4xl font-extrabold text-yellow-600" />
              <span className="text-[#1e3a8a] font-semibold text-center">Consultants expérimentés</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <FaSmile className="text-3xl md:text-4xl text-yellow-600 mb-1" />
              <Counter to={350} duration={1200} className="text-4xl font-extrabold text-yellow-600" />
              <span className="text-[#1e3a8a] font-semibold text-center">Clients satisfaits</span>
            </div>
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-none shadow-xl">
        <h3 className="text-2xl font-bold text-[#1e3a8a] mb-8">Notre parcours</h3>
        <div className="relative border-l-4 border-yellow-600 pl-8 space-y-8">
          <div>
            <div className="absolute -left-5 top-1 w-4 h-4 bg-yellow-600 rounded-full border-4 border-white"></div>
            <span className="font-bold text-[#1e3a8a]">2000</span> — Fondation de la fiduciaire AMAALI SARL par M. AMAALI ABDESLAM.
          </div>
          <div>
            <div className="absolute -left-5 top-1 w-4 h-4 bg-yellow-600 rounded-full border-4 border-white"></div>
            <span className="font-bold text-[#1e3a8a]">2005</span> — Développement de l'offre de conseil et d'accompagnement pour les investisseurs étrangers.
          </div>
          <div>
            <div className="absolute -left-5 top-1 w-4 h-4 bg-yellow-600 rounded-full border-4 border-white"></div>
            <span className="font-bold text-[#1e3a8a]">2015</span> — Renforcement de l'équipe et diversification des services (formation, fiscalité, gestion RH).
          </div>
          <div>
            <div className="absolute -left-5 top-1 w-4 h-4 bg-yellow-600 rounded-full border-4 border-white"></div>
            <span className="font-bold text-[#1e3a8a]">2023</span> — Plus de 350 clients accompagnés.
          </div>
        </div>
      </div>
    </section>
  );
} 