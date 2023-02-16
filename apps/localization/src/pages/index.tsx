import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Keystatic Localization</title>
        <meta
          name="description"
          content="An interface to manage the l10n data for Keystatic"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Keystatic Localization</h1>
        <p>
          This app offers an interface to manage the l10n data for{' '}
          <a href="https://github.com/Thinkmill/keystatic">Keystatic</a>.
        </p>
        <p>
          Keystatic is a new tool from{' '}
          <a href="https://www.thinkmill.com.au/labs">Thinkmill Labs</a> that
          opens up your code-based content (written in Markdown, JSON or YAML)
          to contributors who aren’t technical — or who would just prefer to
          write and manage content and data in a UI that looks more like a CMS
          than VS Code.
        </p>
        <p>
          <Link href="/keystatic">Start editing</Link>
        </p>
      </main>
    </>
  );
}
