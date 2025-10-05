import React from 'react'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
    const sectionRef = useRef(null);
    const project1Ref = useRef(null);
    const project2Ref = useRef(null);
    const project3Ref = useRef(null);

    useGSAP(() => {
        const projects = [project1Ref.current, project2Ref.current,
        project3Ref.current
        ];
        projects.forEach((card, index) => {
            gsap.fromTo(
                card,
                {
                    y: 50, opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.3 * (index + 1),
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100'
                    }
                }
            )
        });
        gsap.fromTo(
            sectionRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.5
            }
        )
    }, []);

    return (
        <section id="work" ref={sectionRef} className='app-showcase'>
            <div className="w-full">
                <div className='showcaselayout'>
                    <a href="https://lcsf2411.github.io/pm-mvp/">
                    <div className='first-project-wrapper' ref={project1Ref} style={{width:"100%"}}>
                        <div className='image-wrapper'>
                            <img src="/images/project_1.png" alt="Ryde" />
                        </div>
                        <div className='text-content'>
                            <h2>Showcasing Lambton College Project management excellence through well designed Webapp
                            </h2>
                            <p className='text-white-50 md:text-xl'>
                                An app built with jQuery, native JS and TailwindCSS for a
                                fast, user friendly experience.
                            </p>
                        </div>
                    </div>
                    </a>

                    <div className='project-list-wrapper overflow-hidden'>
                        <a href="https://lcsf2411.github.io/">
                        <div className='project' ref={project2Ref}>
                            <div className='image-wrapper bg-[#ffefdb]'>
                                <img src="/images/project_2.png" alt="Library Management Platform" />
                            </div>
                            <h2>ArcBlade Works - A Client Exposure Program (Basic WebSite)</h2>
                        </div>
                        </a>
                        <a href="https://moviesmanager.onrender.com/">
                        <div className='project' ref={project3Ref}>
                            <div className='image-wrapper bg-[#ffe7eb]'>
                                <img src="/images/project_3.png" alt="YC Directory" />
                            </div>
                            <h2>Movies Manager - A Startup Showcase WebAPP</h2>
                        </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShowcaseSection