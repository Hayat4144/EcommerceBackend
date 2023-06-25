const Pagination = (page, resultPerpage) => {
  const pagenumber = page || 1;
  const skip = resultPerpage * (pagenumber - 1);
  return skip;
};

module.exports = Pagination;
