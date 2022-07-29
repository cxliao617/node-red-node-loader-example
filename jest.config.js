module.exports = {
    preset:"ts-jest",
    transform:{
        "^.+\\.(t|j)sx?$":"ts-jest"
    },
    testEnvironment: "node",
    testTimeout: 60000,
    testPathIgnorePatterns:[
        "/node_modules/",
        "/dist/"
    ],
    verbose:true,
    reporters:[
        'default',
        [
            'jest-junit',{
                outputDirectory: 'test_reports',
                outputName: 'test-report.xml'
            }
        ]
    ],
    collectCoverage: true,
    coverageReporters: ['cobertura'],
    coverageDirectory: "coverage"
}