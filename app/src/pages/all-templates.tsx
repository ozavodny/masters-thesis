import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const TemplateList = dynamic(() => import('../components/templates/template-list'), {
    ssr: false
})

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>MemeBro | All Templates</title>
      </Head>
      <h1 className="text-3xl font-bold self-center m-6">All Templates</h1>
      <TemplateList fetch="all"></TemplateList>
    </>
  );
};

export default Home;
