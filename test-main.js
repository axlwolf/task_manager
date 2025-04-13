// Import all the spec files from src/tests
const testsContext = require.context('./src/tests', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);
