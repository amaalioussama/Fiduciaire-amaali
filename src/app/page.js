"use client"
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const HeroSection = dynamic(() => import('../components/HeroSection'));
const ServicesPage = dynamic(() => import('./services/page.jsx'));
const AboutPage = dynamic(() => import('./about/page.jsx'));
const TestimonialsPage = dynamic(() => import('./testimonials/page.jsx'));
const CallToActionPage = dynamic(() => import('./cta/page.jsx'));
const ContactPage = dynamic(() => import('./contact/page.jsx'));
const Header = dynamic(() => import('../components/Header.jsx'));
const Navbar = dynamic(() => import('../components/Navbar.jsx'));
const Footer = dynamic(() => import('../components/Footer.jsx'));

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.7, type: 'spring' }
};

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
     
      <motion.div {...sectionAnim} id="hero"><HeroSection /></motion.div>
      <motion.div {...sectionAnim} id="services"><ServicesPage /></motion.div>
      <motion.div {...sectionAnim} id="about"><AboutPage /></motion.div>
      {/* <motion.div {...sectionAnim} id="testimonials"><TestimonialsPage /></motion.div> */}
      <motion.div {...sectionAnim} id="cta"><CallToActionPage /></motion.div>
      <motion.div {...sectionAnim} id="contact"><ContactPage /></motion.div>
      
    </div>
  );
}
