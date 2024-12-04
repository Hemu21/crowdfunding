import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { useWeb3Context } from "./context/Web3Context";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Suspense } from "react";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetail from "./pages/CampaignDetail";
import EditCampaign from "./pages/EditCampaign";
import { Toaster } from 'react-hot-toast';

export function App() {
  const { account } = useWeb3Context();
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          {account?.address ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/edit-campaign/:id" element={<EditCampaign />} />
            </>
          ):<></>}
		  <Route path="*" element={<div>404</div>} />
        </Routes>
        <Toaster />
        <Footer />
      </Suspense>
    </>
  );
}
