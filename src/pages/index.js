import Head from "next/head";
import Nav from "../components/nav";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Oleh Lutsenko - Developer</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital@1&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className="w-full h-full grid grid-rows-layout place-items-center">
        <div className="py-20 grid">
          <h1 className="text-5xl">oleh lutsenko</h1>
        </div>
        <Nav />
      </div>
    </>
  );
}
