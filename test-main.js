// Import all the spec files
const testsContext = require.context('./tests', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);

const srcContext = require.context('./src', true, /\.spec\.ts$/);
srcContext.keys().forEach(srcContext);