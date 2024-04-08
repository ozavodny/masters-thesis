import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const DialogTestComponent = dynamic(() => import('../components/create/import-image/import-image'), {
    ssr: false
})

const DialogTest: NextPage = () => {
  return (
    <>
      <Head>
        <title>MemeBro | DialogTest</title>
      </Head>
      <DialogTestComponent></DialogTestComponent>
    </>
  );
};

export default DialogTest;
