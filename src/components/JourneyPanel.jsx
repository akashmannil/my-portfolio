const JourneyPanel = ({ card, index, total }) => {
  return (
    <article className="journey-panel absolute inset-0 flex items-start md:items-center px-5 md:px-16 pt-44 md:pt-0 invisible first:visible">
      <div className="w-full grid md:grid-cols-12 gap-4 md:gap-12 items-center">
        <div className="md:col-span-4">
          <span className="hidden md:block font-display font-light text-[5rem] md:text-[8rem] leading-none text-outline">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs tracking-[0.3em] text-fog block md:mt-4">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-accent block mt-2 md:mt-6 uppercase">
            {card.date}
          </span>
        </div>
        <div className="md:col-span-8">
          <h3 className="serif-accent text-2xl md:text-5xl mb-4 md:mb-8">{card.title}</h3>
          <ul className="space-y-3 md:space-y-4 max-w-2xl">
            {card.responsibilities.map((item) => (
              <li
                key={item}
                className="text-fog text-sm md:text-lg font-light leading-relaxed pl-4 md:pl-6 border-l border-line"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 md:mt-8 max-w-2xl font-display italic font-light text-paper/70 text-xs md:text-base leading-relaxed">
            “{card.review}”
          </p>
        </div>
      </div>
    </article>
  );
};

export default JourneyPanel;
