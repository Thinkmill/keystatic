export default function Docs() {
  return (
    <div>
      <header className="p-2 text-center">Top navigation</header>
      <main>
        <nav className="inline-block p-2">
          Side nav
          <ul>
            <li>- Getting started</li>
            <li>- Something else</li>
          </ul>
        </nav>
        <div className="inline-block p-2 align-top">CONTENT</div>
      </main>
      <footer className="p-2 text-center">footer</footer>
    </div>
  );
}
