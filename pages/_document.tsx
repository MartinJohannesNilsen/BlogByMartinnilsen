import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Theme */}
        <meta
          name="theme-color"
          content="#fff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#161518"
          media="(prefers-color-scheme: dark)"
        />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* EditorJS LaTeX */}
        {/* <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.19.0/dist/editor.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@latest/dist/editorjs-latex.bundle-min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@latest/dist/editorjs-latex.bundle.min.css"
        ></link>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.12.0/katex.min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.12.0/katex.min.css"
        ></link> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
