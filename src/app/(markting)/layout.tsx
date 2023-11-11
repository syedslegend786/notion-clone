import React from "react";
import { NavBar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <NavBar />
      <main className="h-full pt-14 dark:bg-background-dark ">{children}</main>
    </div>
  );
};

export default MarketingLayout;
