const Footer = () => {
  return (
    <footer className="relative px-5 md:px-16 pt-20 pb-10 overflow-hidden">
      <p
        aria-hidden="true"
        className="text-outline font-medium tracking-[-0.04em] leading-none select-none whitespace-nowrap"
        style={{ fontSize: 'clamp(4rem, 14vw, 13rem)' }}
      >
        Akash Mannil
      </p>
      <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          © {new Date().getFullYear()} Akash Mannil
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
          React <span className="text-accent">✦</span> Three.js{' '}
          <span className="text-accent">✦</span> GSAP
        </p>
        <p className="font-mono text-[9px] tracking-[0.15em] text-fog/60">
          Rocket by{' '}
          <a href="https://poly.pizza/m/dsjkFYy-rb0" className="underline hover:text-fog">
            Gambsmoore
          </a>{' '}
          (CC-BY) · Dish by{' '}
          <a href="https://poly.pizza/m/IDRrztoAMB" className="underline hover:text-fog">
            Kenney
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
