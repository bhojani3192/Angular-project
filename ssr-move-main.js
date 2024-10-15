const fs = require('fs');
const path = require('path');

// Define source and destination paths for main.js and web.config
const filesToMove = [
    { 
        source: path.resolve(__dirname, 'dist/web-dubfeed/browser/ssr-main.js'), 
        destination: path.resolve(__dirname, 'dist/web-dubfeed/main.js') 
    },
    { 
        source: path.resolve(__dirname, 'dist/web-dubfeed/browser/ssr-web.config'), 
        destination: path.resolve(__dirname, 'dist/web-dubfeed/web.config') 
    }
];

filesToMove.forEach(file => {
  fs.rename(file.source, file.destination, (err) => {
    if (err) throw err;
    console.log(`${path.basename(file.source)} was moved to ${path.dirname(file.destination)}.`);
  });
});