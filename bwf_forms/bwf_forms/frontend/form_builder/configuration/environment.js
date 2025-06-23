const path = require('path');
const sourcePath = path.resolve(__dirname, '../src/')
module.exports = {
  entry : {
    app: path.resolve(sourcePath, 'js', 'app.js'),
  },
  paths: {
    /* Path to source files directory */
    source: sourcePath,

    /* Path to built files directory */
    output: path.resolve(__dirname, '../dist/'),
  },
  server: {
    host: 'localhost',
    port: 8075,
  },
  limits: {
    /* Image files size in bytes. Below this value the image file will be served as DataURL (inline base64). */
    images: 8192,

    /* Font files size in bytes. Below this value the font file will be served as DataURL (inline base64). */
    fonts: 8192,
  },
};
