
import { ReactNode } from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout = ({ children, showFooter = true }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
