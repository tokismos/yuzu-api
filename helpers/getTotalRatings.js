const getTotalRatings = (ratingsObj) => {
  const newObj = Object.keys(ratingsObj.toJSON()).map((i) => {
    return { [i.replace(",", ".")]: ratingsObj[i] };
  });
  const total = newObj.reduce(
    (acc, curr) => {
      return {
        total: acc.total + parseFloat(Object.values(curr)[0]),
        totalRate:
          acc.totalRate +
          parseFloat(Object.keys(curr)[0]) * parseFloat(Object.values(curr)[0]),
      };
    },
    { total: 0, totalRate: 0 }
  );
  if (total.total < 4) {
    return "NEW";
  }
  return parseFloat((total.totalRate / total.total).toFixed(1));
};
module.exports = getTotalRatings;
