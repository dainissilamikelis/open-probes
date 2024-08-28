export enum eProbeExecutor {
    web,
    api,
}

export default class ProbeTestCase {
    executor: eProbeExecutor;
    testCaseName: string;
    url: string;
    actions: string[] = [];

    constructor(executor: eProbeExecutor, testCaseName: string, url: string, actions: string[]) {
        this.executor = executor;
        this.testCaseName = testCaseName;
        this.url = url;
        this.actions = actions;
    }

    

    async execute() {
        console.log(`Executing test case: ${this.testCaseName}`);
        console.log(`URL: ${this.url}`);
    }
}


