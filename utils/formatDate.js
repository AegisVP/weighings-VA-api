module.exports = {
  formatDate: d => `${String(d.getFullYear())}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`,
  parseDate: d => new Date(parseInt(d.slice(0, 4)), parseInt(d.slice(4, 2)) - 1, parseInt(d.slice(6)), 0, 0, 0),
};
