const getFilter = (req) => {
  // query?page=5&limit=6&sort=name&order=desc
  const filter = {
    sort: req.query.sort,
    order: req.query.order || 'asc',
    limit: req.query.limit || process.env.PAGINATION_LIMIT * 1,
    skip: 0,
  };

  if (req.query.page) {
    filter.skip = filter.limit * (req.query.page - 1);
  }

  return filter;
};

module.exports = getFilter;
