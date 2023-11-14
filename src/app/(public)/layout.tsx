import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full dark:bg-background-dark">{children}</div>;
};

export default PublicLayout;
