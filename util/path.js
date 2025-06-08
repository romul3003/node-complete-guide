const path = require('path');
// This module exports the directory name of the main module, which is typically the root directory of the application.
module.exports = path.dirname(require.main.filename);
