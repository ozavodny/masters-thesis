import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const Memes = dynamic(() => import('../components/memes/meme-list'), {
    ssr: false
})

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>MemeBro | My Memes</title>
      </Head>
      <h1 className="text-3xl font-bold self-center m-6">My Memes</h1>
      <Memes></Memes>
    </>
  );
};

export default Home;
