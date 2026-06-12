import ContactForm from '../components/ContactForm';
import { socialImgs } from '../constants';

const Contact = () => {
  return (
    <section id="contact" className="relative px-5 md:px-16 py-32 md:py-48">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <p className="eyebrow mb-3">One more thing</p>
          <h2 className="display-section mb-10">
            Let’s build something{' '}
            <span className="serif-accent text-ember">quietly brilliant.</span>
          </h2>
          <p className="text-fog font-light text-lg leading-relaxed max-w-md mb-12">
            Have a project, a role, or just an idea worth talking about? My inbox
            is always open.
          </p>
          <div className="flex gap-6">
            {socialImgs.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs uppercase tracking-[0.25em] text-fog hover:text-accent transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
