const getConstants = async (req, res, next) => {
  // const searchParams = {};
  // const { source, driver, date } = req.query;
  // let { year, month, day } = req.query;

  // if (!year || !month || !day) {
  //   const parseDate = new Date(date || Date.now());
  //   [year, month, day] = [parseDate.getFullYear(), parseDate.getMonth() + 1, parseDate.getDate()];
  // }

  // year = parseInt(year);
  // month = parseInt(month);
  // day = parseInt(day);

  // searchParams.date = { year, month, day };
  // if (source) searchParams['crop.source'] = source;
  // if (driver) searchParams['auto.driver'] = driver;
  // // if (source) searchParams['crop.source'] = source;
  // // if (source) searchParams['crop.source'] = source;

  // console.log({ searchParams });
  // const result = await Weighings.find(searchParams);

  // res.json({ length: result.length, weighings: result });
  res.json({ message: 'getConstants ran. TODO: return data' });
};

module.exports = { getConstants };
