import { createContext, useContext, useEffect, useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import {
  defineChain,
  getContract,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { client } from "../client";
import { BigIntToHumanReadable, getTimeLeft, WeiToEth } from "../util/conversions";

const web3Context = createContext();
const address = import.meta.env.VITE_ADDRESS;
const Web3Context = ({ children }) => {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending, data, error, failureReason, isError, isPaused, isSuccess } = useSendTransaction();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: address,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getCampaigns = async (setLoading) => {
    setLoading(true);
    let data = await readContract({
      contract,
      method:
        "function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, uint256 donators, uint8 state, uint256 tiers)[])",
      params: [],
    });
    data = data.map((campaign, index) => ({
      ...campaign,
      target: WeiToEth(campaign.target.toString()),
      deadline: getTimeLeft(campaign.deadline.toString()),
      id: index,
      amountCollected: WeiToEth(campaign.amountCollected.toString()),
      tiers: BigIntToHumanReadable(campaign.tiers),
      donators: BigIntToHumanReadable(campaign.donators),
    }));
    setLoading(false);
    return data;
  };

  const getMyCampaigns = async (setLoading) => {
    setLoading(true);
    const data = await getCampaigns(setLoading);
    const result = data.filter(
      (campaign) => campaign?.owner === account?.address
    );
    setLoading(false);
    return result;
  };

  const getCampaign = async (id) => {
    const data = await readContract({
      contract,
      method:
        "function getCampaign(uint256 _id) view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint8 state, (string name, uint256 amount, uint256 backers)[] tiers))",
      params: [id],
    });
    return {
      ...data,
      target: WeiToEth(data.target.toString()),
      deadline: data.deadline.toString(),
      id,
      amountCollected: WeiToEth(data.amountCollected.toString()),
      tiers: BigIntToHumanReadable(data.tiers),
      donators: BigIntToHumanReadable(data.donators),
    };
  };

  const getBackers = async (id) => {
    const data = await readContract({
      contract,
      method: "function getBackers(uint256 _id) view returns (address[])",
      params: [id],
    });
    return data;
  };

  const getFundedTiers = async (id, backer) => {
    const data = await readContract({
      contract,
      method:
        "function getFundedTiers(uint256 _id, address _backer) view returns (bool[])",
      params: [id, backer],
    });
    return data;
  };

  const getNumberOfBackers = async (id) => {
    const data = await readContract({
      contract,
      method: "function getNumberOfBackers(uint256 _id) view returns (uint256)",
      params: [id],
    });
    return data;
  };

  const getNumberOfCampaigns = async () => {
    const data = await readContract({
      contract,
      method: "function getNumberOfCampaigns() view returns (uint256)",
      params: [],
    });
    return data;
  };

  const getTiers = async (id) => {
    const data = await readContract({
      contract,
      method:
        "function getTiers(uint256 _id) view returns ((string name, uint256 amount, uint256 backers)[])",
      params: [id],
    });
    return data;
  };

  const getTotalContribution = async (id, backer) => {
    const data = await readContract({
      contract,
      method:
        "function getTotalContribution(uint256 _id, address _backer) view returns (uint256)",
      params: [id, backer],
    });
    return data;
  };

  const createCampaign = async (form) => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function createCampaign(string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)",
      params: [
        form.title,
        form.description,
        form.target,
        form.deadline,
        form.image,
      ],
    });
  };

  const addTier = (id, name, amount) => {
    const transaction = prepareContractCall({
      contract,
      method: "function addTier(uint256 _id, string _name, uint256 _amount)",
      params: [id, name, amount],
    });
    sendTransaction(transaction);
  };

  const fund = async (id, tierIndex, amount) => {
    const transaction = prepareContractCall({
      contract,
      method: "function fund(uint256 _id, uint256 _tierIndex) payable",
      params: [id, tierIndex],
      value: amount,
    });
    sendTransaction(transaction);
  };

  const refund = (id) => {
    const transaction = prepareContractCall({
      contract,
      method: "function refund(uint256 _id)",
      params: [id],
    });
    sendTransaction(transaction);
  };

  const withdraw = (id) => {
    const transaction = prepareContractCall({
      contract,
      method: "function withdraw(uint256 _id)",
      params: [id],
    });
    sendTransaction(transaction);
  };

  const updateCampaign = async (id, title, description, target, deadline, image) => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function updateCampaign(uint256 _id, string _title, string _description, uint256 _target, uint256 _deadline, string _image)",
      params: [
        id,
        title,
        description,
        target,
        deadline,
        image,
      ],
    });
    sendTransaction(transaction);
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <web3Context.Provider
      value={{
        account,
        theme,
        toggleTheme,
        createCampaign,
        getCampaigns,
        getCampaign,
        getMyCampaigns,
        getBackers,
        getFundedTiers,
        updateCampaign,
        getNumberOfCampaigns,
        getTiers,
        addTier,
        fund,
        refund,
        withdraw,
        getTotalContribution,
        getNumberOfBackers
      }}
    >
      {children}
    </web3Context.Provider>
  );
};

const useWeb3Context = () => {
  return useContext(web3Context);
};

export { useWeb3Context };
export default Web3Context;
