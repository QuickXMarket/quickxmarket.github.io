import React, { useEffect, useRef } from "react";
import MainBanner from "../components/MainBanner";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Navbar from "../components/Navbar";
import DashboardFeatures from "../components/DashboardFeatures";
import { useCoreContext } from "../context/CoreContext";

const Home = () => {
  const { location } = useCoreContext();
  const faqRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#faq" && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  return (
    <>
      <Navbar />
      <div>
        <MainBanner />
        <DashboardFeatures />
        <FAQ ref={faqRef} />
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
