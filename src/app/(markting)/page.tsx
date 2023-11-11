import React from "react";
import { Heading } from "./_components/heading";
import { Heros } from "./_components/heros";
import { Footer } from "./_components/footer";

const MarketingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Heading />
        <Heros />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
