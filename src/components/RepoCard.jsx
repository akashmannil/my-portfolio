const RepoCard = ({ repo }) => {
  return (
    <article className="repo-card panel-card group flex flex-col overflow-hidden">
      <div className="overflow-hidden border-b border-line">
        <img
          src={repo.imgPath}
          alt={`${repo.title} repository card`}
          loading="lazy"
          className="w-full aspect-2/1 object-cover group-hover:scale-[1.03] transition-transform duration-700"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h4 className="text-xl font-medium tracking-tight mb-2 group-hover:text-accent transition-colors duration-300">
          {repo.title}
        </h4>
        <p className="text-fog text-sm font-light leading-relaxed mb-5">{repo.desc}</p>
        {repo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {repo.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.2em] border border-line rounded-full px-3 py-1.5 text-fog"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-6">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent hover:text-paper transition-colors duration-300"
          >
            Code ↗
          </a>
          {repo.live && (
            <a
              href={repo.live}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-glacier hover:text-paper transition-colors duration-300"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default RepoCard;
