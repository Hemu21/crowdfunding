import { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import { useWeb3Context } from "../context/Web3Context";
import { NavLink } from "react-router";

const Dashboard = () => {
  const { getMyCampaigns, account } = useWeb3Context();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (account?.address) {
      fetchData();
    }
  }, [account?.address]);
  const fetchData = async ()=>{
    const data = await getMyCampaigns(setLoading);
    setCampaigns(data);
  }
  return (
    <div className="w-[90%] min-h-screen flex gap-10 m-auto mt-10">
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          {campaigns?.map((ele, index) => (
            <CampaignCard key={index} data={ele} />
          ))}
          <div className="min-w-[280px] h-[460px] flex justify-center items-center rounded-xl shadow-lg dark:shadow-none hover:shadow-2xl hover:dark:shadow-xl transition-shadow duration-300 p-0 border dark:border-gray-700 bg-white dark:bg-gray-900 border-gray-300 w-96 cursor-pointer">
            <NavLink to="/create-campaign">
              <p>Create New Campaign +</p>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
