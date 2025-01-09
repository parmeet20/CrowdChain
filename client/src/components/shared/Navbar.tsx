import React, { useState } from "react";
import { useContractContext } from "../../context/contractContext";
import CreateCampaignDialog from "./CreateCampaignDialog";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const { account } = useContractContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <div className="fixed top-0 left-0 m-4 right-0 p-2 items-center flex justify-between bg-white/20 bg-opacity-30 backdrop-blur-md rounded-lg shadow-md z-50">
      <h1 className="text-xl font-semibold">CrowdChain</h1>

      <div className="hidden items-center md:flex">
        <div className="px-4 py-2">
          <CreateCampaignDialog />
        </div>
        <Button variant="secondary" className="px-4 py-2 text-sm text-gray-700">
          {account ? `Account: ${account}` : "Not connected"}
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-xl focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } absolute left-0 right-0 top-16 bg-white w-full py-2 rounded-lg shadow-md transition-all ease-in-out duration-300 z-40`}
        >
          <div className="px-4 py-2">
            <CreateCampaignDialog />
          </div>
          <Button variant="ghost" className="px-4 py-2 text-sm text-gray-700">
            {account ? `Account: ${account}` : "Not connected"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
