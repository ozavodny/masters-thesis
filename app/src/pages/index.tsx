import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const MemeIndex = dynamic(() => import('../components/create/create'), {
    ssr: false
})

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>MemeBro | Create</title>
      </Head>
        <MemeIndex></MemeIndex>
    </>
  );
};

export default Home;
