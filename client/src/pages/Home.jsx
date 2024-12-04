import { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import { useWeb3Context } from "../context/Web3Context";

const Home = () => {
  const { getCampaigns } = useWeb3Context();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getCampaigns(setLoading).then((data) =>
      setCampaigns(data)
    );
  }, []);
  
  return (
    <div className="w-[90%] min-h-screen m-auto mt-10">
      {loading?<div>loading...</div>:campaigns?.map((ele, index) => (
        <CampaignCard key={index} data={ele} />
      ))}
    </div>
  );
};

export default Home;
