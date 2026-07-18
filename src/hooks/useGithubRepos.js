import { useEffect, useState } from 'react';
import { github, projects } from '../constants';

const featured = new Set(projects.map((p) => p.repoName));

const prettify = (name) =>
  name.replace(/[-_]+/g, ' ').replace(/(^|\s)[a-z]/g, (c) => c.toUpperCase());

// cached at module level so switching tabs never refetches
let cache = null;

const toCard = (repo) => ({
  name: repo.name,
  title: prettify(repo.name),
  desc:
    repo.description ||
    `Open-source ${repo.language || 'software'} project — actively developed on GitHub.`,
  imgPath: `https://opengraph.githubassets.com/1/${github.username}/${repo.name}`,
  url: repo.html_url,
  live: repo.homepage || null,
  tags: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 3),
});

const useGithubRepos = () => {
  const [state, setState] = useState(
    cache ? { repos: cache, status: 'ready' } : { repos: [], status: 'loading' }
  );

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();
    fetch(
      `https://api.github.com/users/${github.username}/repos?sort=pushed&per_page=100`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        cache = data
          .filter(
            (repo) =>
              !repo.fork &&
              !repo.archived &&
              !featured.has(repo.name) &&
              !github.excludeRepos.includes(repo.name) &&
              !github.excludePrefixes.some((prefix) => repo.name.startsWith(prefix))
          )
          .slice(0, github.maxRepos)
          .map(toCard);
        setState({ repos: cache, status: 'ready' });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ repos: [], status: 'error' });
      });
    return () => controller.abort();
  }, []);

  return state;
};

export default useGithubRepos;
