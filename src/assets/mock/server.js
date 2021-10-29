var tableData = require("./table-data.json");
var metaData = require("./meta-data.json");
var tableChangeLogs = require("./table-change-logs.json");

module.exports = () => ({
  'table-data': tableData,
  'meta-data': metaData,
  'table-change-logs': tableChangeLogs
});
