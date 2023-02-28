import Link from 'next/link';

export default function Index() {
  return (
    <main
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginInline: 'auto',
        maxWidth: 440,
        minHeight: '100vh',
      }}
    >
      <h1>Demo app</h1>
      <p>
        <a href="https://keystatic.thinkmill.com.au/">Keystatic</a> is a new
        tool that makes Markdown, JSON and YAML content in your codebase
        editable by humans.
      </p>
      <p>
        <Link href="/keystatic">Start editing</Link>.
      </p>
    </main>
  );
}
