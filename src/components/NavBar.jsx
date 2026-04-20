import React from 'react'
import { navLinks } from '../constants'
import { useEffect, useState } from 'react';

const NavBar = () => {
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

                <nav className='desktop'>
                    <ul>
                        {navLinks.map(({ link, name }) => (
                            <li key={name} className='group'>
                                <a href={link} onClick={handleDownload}>
                                    <span>{name}</span>
                                    <span className='underline'></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <a href="#contact" className='contact-btn group'>
                    <div className='inner'>
                        <span>Contact Me</span>
                    </div>
                </a>
            </div>
        </header>
    )
}

export default NavBar