<<<<<<< Updated upstream
import React from 'react'
import { navLinks } from '../constants'
=======
>>>>>>> Stashed changes
import { useEffect, useState } from 'react';
import { navLinks } from '../constants';

const NavBar = () => {
<<<<<<< Updated upstream
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(true);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
    const handleDownload = (e) => {
        if (e.currentTarget.getAttribute('href') != "") {
            return;
        }
        const link = document.createElement('a');
        link.href = '/Akash-Mannil-Restaurant-Resume.docx';
        link.download = 'Akash_M_Resume.docx'; // customize the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
            <div className='inner'>
                <a className='logo' href="#hero">
                    Akash | AM
                </a>
=======
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
>>>>>>> Stashed changes

  const handleDownload = (e) => {
    if (e.currentTarget.getAttribute('href') !== '') return;
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/My_Resume_9_10.pdf';
    link.download = 'Akash_Mannil_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 px-5 md:px-16 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-ink/70 backdrop-blur-md border-b border-line'
          : 'py-7 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <a href="#hero" className="text-lg tracking-tight">
          Akash <span className="serif-accent text-accent">Mannil</span>
        </a>
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map(({ link, name }) => (
            <a
              key={name}
              href={link}
              onClick={handleDownload}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog hover:text-paper transition-colors duration-300"
            >
              {name}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="font-mono text-[11px] uppercase tracking-[0.25em] border border-line rounded-full px-6 py-3 hover:bg-paper hover:text-ink transition-all duration-300"
        >
          Contact
        </a>
      </div>
    </header>
  );
};

export default NavBar;
