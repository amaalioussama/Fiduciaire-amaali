import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white flex flex-col sm:flex-row items-center justify-between px-4 py-3 shadow-2xl z-30 border-b border-black/10">
      <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
        <Image src="/elevate.png" alt="Logo" width={180} height={8} />
      </div>
      <div className="flex flex-wrap items-center gap-6 justify-center w-full sm:w-auto sm:mt-0">
        <Link className="font-semibold text-[#1e3a8a] hover:text-[#fbbf24] transition" href="/">Accueil</Link>
        <Link className="font-semibold text-[#1e3a8a] hover:text-[#fbbf24] transition" href="#services">Services</Link>
        <Link className="font-semibold text-[#1e3a8a] hover:text-[#fbbf24] transition" href="#about">À propos</Link>
        <Link className="font-semibold text-[#1e3a8a] hover:text-[#fbbf24] transition" href="#testimonials">Témoignages</Link>

        <Link className="font-semibold text-[#1e3a8a] hover:text-[#fbbf24] transition" href="#contact">Contact </Link>
      </div>
    </nav>
  );
}
