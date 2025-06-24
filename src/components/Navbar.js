import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem 0' }}>
      <Link href="/">Accueil</Link>
      <Link href="/services">Services</Link>
      <Link href="/about">À propos</Link>
      <Link href="/testimonials">Témoignages</Link>
      <Link href="/cta">Appel à l'action</Link>
      <Link href="/contact">Contact & RDV</Link>
    </nav>
  );
} 