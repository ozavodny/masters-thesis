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
        <title>MemeBro | My Templates</title>
      </Head>
      <h1 className="text-3xl font-bold self-center m-6">My Templates</h1>
      <TemplateList fetch="fromUser" editable={true}></TemplateList>
    </>
  );
};

export default Home;
