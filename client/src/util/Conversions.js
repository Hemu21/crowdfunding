const EthToWei = (value) => {
  return value * 10 ** 18;
};

const WeiToEth = (value) => {
  return value / 10 ** 18;
};

const convertToSolidityTimestamp = (datetime) => {
  const timestamp = Math.floor(new Date(datetime).getTime() / 1000);
  return timestamp;
};

const getTimeLeft = (blockTimestamp) => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeLeft = blockTimestamp - currentTime;

  if (timeLeft <= 0) {
    return "Time is up";
  }

  const days = Math.floor(timeLeft / (60 * 60 * 24));
  const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = timeLeft % 60;

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} left`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} left`;
  }
};

const BigIntToHumanReadable = (bigIntValue) => {
  if (bigIntValue === 0n) {
    return "0";
  }

  return bigIntValue.toString();
};

const getPercentage = (amountCollected, target) => {
    return (amountCollected / target) * 100;
}

export {
  EthToWei,
  WeiToEth,
  convertToSolidityTimestamp,
  getTimeLeft,
  BigIntToHumanReadable,
  getPercentage
};
