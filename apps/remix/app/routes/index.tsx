export default function Index() {
  const linkLabels = {
    blogTutorial: '15m Quickstart Blog Tutorial',
    jokesTutorial: 'Deep Dive Jokes App Tutorial',
    docs: 'Remix Docs',
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1 id="heading-1-overview">Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
            aria-label={`${linkLabels.blogTutorial} (Opens in new tab)`}
          >
            {linkLabels.blogTutorial}
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
            aria-label={`${linkLabels.jokesTutorial} (Opens in new tab)`}
          >
            {linkLabels.jokesTutorial}
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
            aria-label={`${linkLabels.docs} (Opens in new tab)`}
          >
            {linkLabels.docs}
          </a>
        </li>
      </ul>
    </div>
  );
}
