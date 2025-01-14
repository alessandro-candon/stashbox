exports.config = {
    runner: 'local',
    specs: [
        './tests/**/*.test.js'
    ],
    exclude: [],
    maxInstances: 10,
    capabilities: [
        {
            browserName: 'electron',
            'wdio:electronServiceOptions': {
                appEntryPoint: './src/main.js',
                appArgs: [],
            },
        },
    ],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['electron'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}