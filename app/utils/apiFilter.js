const getFilter = (req) => {
  // E.g:  query?page=5&limit=6&sort=name&order=desc
  const { sort, order, limit, page, all } = req.query;
  if (all === 'true') return { sort, order: order || 'asc' };

  const filter = {
    sort,
    skip: 0,
    order: order || 'asc',
    limit: limit || process.env.PAGINATION_LIMIT * 1,
  };
  if (page) filter.skip = filter.limit * (page - 1);

  return filter;
};

module.exports = getFilter;
