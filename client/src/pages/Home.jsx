import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";
import Services from "../components/Services";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Services />
      <Categories />
      <BestSeller />
      <BottomBanner />
      {/* <NewsLetter /> */}
    </div>
  );
};

export default Home;
