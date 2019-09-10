// config for pivotal cloud
const pivotal = {
    appName: 'alfredmohltc.cfapps.io', // your pivotal app name
    serverUrl: 'https://alfredmohltc.cfapps.io.cfapps.io', // the route for this app
    frontendUrl: 'https://alfredmohltc.cfapps.io.cfapps.io/react',
};

// config for amazon cloud
const aws = {
    serverUrl: 'http://ec2-3-13-195-83.us-east-2.compute.amazonaws.com',
    frontendUrl: 'http://ec2-3-13-195-83.us-east-2.compute.amazonaws.com/react',
};

module.exports = {aws, pivotal};
