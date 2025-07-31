import React from "react";
import MainBanner from "../components/MainBanner";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="mt-10">
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
