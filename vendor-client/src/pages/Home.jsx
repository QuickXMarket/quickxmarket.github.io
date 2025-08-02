import React from "react";
import MainBanner from "../components/MainBanner";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
        <MainBanner />
        <FAQ />
        {/* <Categories />
      <BestSeller />
      <BottomBanner/>
      <NewsLetter /> */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
