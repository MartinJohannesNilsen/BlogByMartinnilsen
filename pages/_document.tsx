import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="author" content="Martin Johannes Nilsen" />
        <meta
          name="description"
          content="A tech blog by Martin Johannes Nilsen, a Software Engineer, M.Sc. Student and passionate problem solver."
        />
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

        {/* <!-- Open Graph --> */}
        <meta property="og:url" content="https://MJNTech.dev" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180377_2iAVJqBQSo3cgKaVp8vMBR8asrC61DoU.jpg"
        />
        <meta property="og:title" content="Tech blog" />
        <meta
          property="og:description"
          content="A tech blog by Martin Johannes Nilsen, a Software Engineer, M.Sc. Student and passionate problem solver."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@MartinJNilsen" />
        <meta
          name="twitter:image"
          content="https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180377_2iAVJqBQSo3cgKaVp8vMBR8asrC61DoU.jpg"
        />
        <meta name="twitter:title" content="Tech blog" />
        <meta
          name="twitter:description"
          content="A tech blog by Martin Johannes Nilsen, a Software Engineer, M.Sc. Student and passionate problem solver."
        />

        {/* EditorJS LaTeX */}
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.19.0/dist/editor.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@latest/dist/editorjs-latex.bundle-min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/mdgaziur/EditorJS-LaTeX@latest/dist/editorjs-latex.bundle.min.css"
        ></link>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.12.0/katex.min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.12.0/katex.min.css"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
