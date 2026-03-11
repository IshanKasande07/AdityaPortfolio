import React from 'react';
import AboutUs from '@/components/AboutUs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen text-white">
      <FloatingCTA />
      
      {/* 
        We use the Navbar here but pass a prop or rely on the fact that 
        on /about, scrollIntoView to #work/#impact might not work. 
        We should probably handle navigation back to home. 
      */}
      <Navbar />

      <main className="pt-24 pb-12">
        <AboutUs />
      </main>

      <Footer />
    </div>
  );
}
