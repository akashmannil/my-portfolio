const JourneyPanel = ({ card, index, total }) => {
  return (
    <article className="journey-panel absolute inset-0 flex items-center px-5 md:px-16 invisible first:visible">
      <div className="w-full grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="md:col-span-4">
          <span className="font-display font-light text-[5rem] md:text-[8rem] leading-none text-outline block">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs tracking-[0.3em] text-fog block mt-4">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-accent block mt-6 uppercase">
            {card.date}
          </span>
        </div>
        <div className="md:col-span-8">
          <h3 className="serif-accent text-3xl md:text-5xl mb-8">{card.title}</h3>
          <ul className="space-y-4 max-w-2xl">
            {card.responsibilities.map((item) => (
              <li
                key={item}
                className="text-fog text-base md:text-lg font-light leading-relaxed pl-6 border-l border-line"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl font-display italic font-light text-paper/70 text-sm md:text-base leading-relaxed">
            “{card.review}”
          </p>
        </div>
      </div>
    </article>
  );
};

export default JourneyPanel;
