import { useState } from "react";
import { useWeb3Context } from "../context/Web3Context";
import { convertToSolidityTimestamp, EthToWei } from "../util/conversions";

const CreateCampaign = () => {
  const { createCampaign } = useWeb3Context();
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm({
      ...form,
      [name]: value,
    });
    console.log(form.deadline);
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    if (!form.title) newErrors.title = "Title is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.target || form.target <= 0)
      newErrors.target = "Target must be a positive value in ETH";
    if (!form.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const selectedDate = new Date(form.deadline);
      if (selectedDate <= now) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }
    if (!form.image) newErrors.image = "Image URL is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    await createCampaign({...form, target: EthToWei(form.target), deadline: convertToSolidityTimestamp(form.deadline)});
    setForm({
      title: "",
      description: "",
      target: "",
      deadline: "",
      image: "",
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-900 dark:text-gray-200 shadow-md rounded-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Create Campaign
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Fill out the details below to create your new campaign.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={(e) => handleChange(e.target)}
              type="text"
              className={`mt-1 p-2 border ${
                errors.title
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => handleChange(e.target)}
              className={`mt-1 p-2 border ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200`}
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Amount (ETH)
            </label>
            <input
              name="target"
              value={form.target}
              onChange={(e) => handleChange(e.target)}
              type="number"
              className={`mt-1 p-2 border ${
                errors.target
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            {errors.target && (
              <p className="text-sm text-red-500 mt-1">{errors.target}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deadline
            </label>
            <input
              name="deadline"
              value={form.deadline}
              onChange={(e) => handleChange(e.target)}
              type="datetime-local"
              className={`mt-1 p-2 border ${
                errors.deadline
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            {errors.deadline && (
              <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={(e) => handleChange(e.target)}
              type="text"
              className={`mt-1 p-2 border ${
                errors.image
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200`}
            />
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md font-medium ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }`}
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
