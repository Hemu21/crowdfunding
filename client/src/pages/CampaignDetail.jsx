import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/Web3Context";
import { NavLink, useParams } from "react-router";
import {
  BigIntToHumanReadable,
  EthToWei,
  getPercentage,
  getTimeLeft,
  WeiToEth,
} from "../util/Conversions";

const CampaignDetail = () => {
  const {
    getCampaign,
    getBackers,
    getNumberOfBackers,
    getTiers,
    addTier,
    account,
    getTotalContribution,
    getFundedTiers,
    fund,
  } = useWeb3Context();
  const { id } = useParams();
  const [campaign, setCampaign] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tierName, setTierName] = useState("");
  const [tierAmount, setTierAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [donatorModalData, setDonatorModalData] = useState(null);
  const [isDonatorModalOpen, setIsDonatorModalOpen] = useState(false);

  useEffect(() => {
    getAllDetails();
  }, [id]);

  useEffect(() => {
    if (campaign?.owner === account?.address) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [account?.address, id, campaign]);

  const getAllDetails = async () => {
    setLoading(true);
    let data = await getCampaign(id);
    let backers = await getNumberOfBackers(id);
    data.numberOfDonators = BigIntToHumanReadable(backers);
    let donators = await getBackers(id);
    data.donators = [...new Set(donators)];
    let tiers = await getTiers(id);
    data.deadline = getTimeLeft(data.deadline);
    data.tiers = tiers?.map((ele) => ({
      ...ele,
      amount: WeiToEth(BigIntToHumanReadable(ele.amount)),
    }));
    data.isClosed = getPercentage(data?.amountCollected, data?.target) >= 100;
    data.progressPercentage = Math.min(
      getPercentage(data?.amountCollected, data?.target),
      100
    );
    setCampaign(data);
    setLoading(false);
  };

  const getFundedTier = async (_backer) => {
    const fundedTiers = await getFundedTiers(id, _backer);
    const totalContribution = await getTotalContribution(id, _backer);

    setDonatorModalData({
      backer: _backer,
      totalContribution: WeiToEth(BigIntToHumanReadable(totalContribution)),
      fundedTiers: campaign?.tiers?.map(
        (tier, index) =>
          fundedTiers[index] && {
            ...tier,
            amount: tier.amount,
          }
      ),
    });

    setIsDonatorModalOpen(true); // Open modal
  };

  const handleCreateTier = async () => {
    if (!tierName || !tierAmount) {
      alert("Please fill out all fields.");
      return;
    }
    await addTier(id, tierName, EthToWei(tierAmount));
    setIsModalOpen(false);
    setTierName("");
    setTierAmount("");
    getAllDetails();
  };

  return (
    <div className="container mx-auto min-h-screen px-6 py-12">
      {/* Main Section */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Campaign Image */}
            <div className="relative lg:w-2/3">
              <img
                src={campaign?.image}
                alt="Campaign"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div
                className={`absolute top-4 right-4 px-4 py-2 text-sm font-bold rounded-full ${
                  campaign?.isClosed
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                } shadow-md`}
              >
                {campaign?.isClosed ? "Closed" : "Active"}
              </div>
            </div>

            {/* Campaign Details */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Target
                  </h2>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {campaign?.target} ETH
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Days Left
                  </h2>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {campaign.deadline}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Number of Donators
                </h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {campaign?.numberOfDonators}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="my-8">
            <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all ${
                  campaign?.isClosed ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${campaign?.progressPercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-gray-700 dark:text-gray-400">
              {campaign?.isClosed
                ? "Campaign Closed"
                : `${campaign?.progressPercentage}% Collected`}
            </p>
          </div>

          {/* Campaign Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg relative shadow-lg mb-8">
            {/* {isOwner && (
              <button className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                <NavLink to={`/edit-campaign/${id}`}>Edit Contract</NavLink>
              </button>
            )} */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {campaign?.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {campaign?.description}
            </p>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Owner
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {campaign?.owner}
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Amount Collected: {campaign?.amountCollected} ETH
            </p>
            {campaign?.isClosed && <button>Claim Funds</button>}
          </div>

          {/* Tiers Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Tiers
            </h2>
            <div className="flex flex-wrap gap-4">
              {campaign?.tiers?.map((tier, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md w-60"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amount: {tier.amount} ETH
                  </p>

                  <button
                    onClick={() => {campaign?.deadline =="Time is up" ? alert("Time is up") :
                      fund(id, index, EthToWei(tier.amount));
                    }}
                    className="bg-green-500 text-white w-full py-2 rounded-lg shadow-md hover:bg-green-600 mt-2"
                  >
                    Fund
                  </button>
                </div>
              ))}
              {isOwner && (
                <div
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md w-60 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span className="text-lg font-semibold text-center block">
                    Create Tier +
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Donators
            </h2>
            {campaign?.donators?.length > 0 ? (
              <ul className="space-y-4">
                {campaign?.donators.map((donator, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-100 dark:bg-gray-700 flex justify-between rounded-lg shadow-md text-gray-800 dark:text-gray-100"
                  >
                    {donator}
                    <button
                      onClick={() => getFundedTier(donator)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 ml-2"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No donators yet.
              </p>
            )}
          </div>
        </>
      )}
      {/* Modal for Creating Tier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Create New Tier
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600 dark:text-gray-400">
                  Tier Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400">
                  Tier Amount (ETH)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                  value={tierAmount}
                  onChange={(e) => setTierAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleCreateTier}
              >
                Create Tier
              </button>
            </div>
          </div>
        </div>
      )}
      {isDonatorModalOpen && donatorModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Donator Details
            </h2>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              Address: {donatorModalData.backer}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Total Contribution: {donatorModalData.totalContribution} ETH
            </p>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Funded Tiers
            </h3>
            {donatorModalData.fundedTiers.length > 0 ? (
              <ul className="space-y-2">
                {donatorModalData.fundedTiers.map((tier, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
                  >
                    <p className="text-gray-800 dark:text-gray-100">
                      Tier: {tier.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Amount: {tier.amount} ETH
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No funded tiers.
              </p>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => setIsDonatorModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
