import puppeteer, { Browser, BrowserContext, Page } from 'puppeteer-core';

import ProbeTestAction, { eProbeActionTypes } from '../actions';
import RedisMiddleware from '../middleware/redis';

export interface iProbeTestCaseActionResult {
    action: eProbeActionTypes,
    latency: number;
    failed: boolean;
    errored: boolean;
    errorCode: string
}

export interface iProbeTestCaseResult {
    actionResults: iProbeTestCaseActionResult[],
    result: string;
    latency: number,
    failed: boolean,
    errored: boolean,
    errorCodes: string[],
}

class PuppeteerConnector {
    actions: ProbeTestAction[];
    endpoint: string;
    name: string;
    private page: Page;
    private browser: Browser;
    private context: BrowserContext;
    private redisClient: RedisMiddleware;
    constructor(name: string, endpoint: string,  actions: ProbeTestAction[], redisClient: RedisMiddleware) {
        this.actions = actions;
        this.endpoint = endpoint;
        this.name = name;
        this.redisClient = redisClient;
    }

    public async launchBrowser() {
        this.browser = await puppeteer.connect({
            browserWSEndpoint: this.endpoint,
          });
        this.context = await this.browser.createBrowserContext();
        this.page = await this.context.newPage();
    }

    public async execute() {
       const actionResults: iProbeTestCaseActionResult[] = [];
        try {;
            console.log(`Executing test case: ${this.name}`);
            for(const action of this.actions) {
                const actionDescription: iProbeTestCaseActionResult = {
                    action: action.properties.command,
                    latency: 0,
                    failed: true,
                    errored: true,
                    errorCode: "",
                }
                console.log(`EXECUTING ACTION ${action.properties.command}`)
                const start = performance.now();
                try { 
                    const resp = await this.page[action.command](...action.attributes)
                    actionDescription.failed = false;
                    actionDescription.errored = false;
                } catch (err) {
                    actionDescription.errorCode = err.message;
                } finally {
                    const end = performance.now();
                    actionDescription.latency = end - start;
                    actionResults.push(actionDescription);

                }
            }

        // send to result
        await this.redisClient.set("test1", JSON.stringify(actionResults))
        } catch (err) {
            throw new Error("Failed case")
        }
    }

}

export default PuppeteerConnector;