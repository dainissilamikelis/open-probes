import { RedisClientOptions } from "redis";
import ProbeTestAction, { eProbeActionTypes } from "./actions";
import ChromeHelper from "./chromeHelpers";
import CPDWebSocketClient from "./connection";
import RedisMiddleware from "./middleware/redis";

export enum eProbeExecutor {
    web,
    api,
}

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

class ProbeTestCase {
    executor: eProbeExecutor;
    testCaseName: string;
    url: string;
    actions: ProbeTestAction[] = [];
    private client: CPDWebSocketClient;
    private redis: RedisMiddleware;
    constructor(executor: eProbeExecutor, redis: RedisMiddleware, testCaseName: string, url: string, actions: ProbeTestAction[]) {
        this.executor = executor;
        this.testCaseName = testCaseName;
        this.url = url;
        this.actions = actions;
        this.redis = redis;
    }

    async execute() {    
        const actionResults: iProbeTestCaseActionResult[] = [];
        try {
            await this.establishConnection();
            console.log(`Executing test case: ${this.testCaseName}`);
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
                    await this.client.sendCommand(action.properties.command as string, action.attributes);
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
        await this.redis.set("test1", JSON.stringify(actionResults))
        console.log(`URL: ${this.url}`);
        } catch (err) {
            throw new Error("Failed case")
        } finally {
            this.client.close();
        }
    }

    private async establishConnection() {
        const chromeHelper = new ChromeHelper();
        const debugInformation = await chromeHelper.extractJSONinformation();
        this.client = new CPDWebSocketClient(debugInformation.webSocketDebuggerUrl);
    }
}

export default ProbeTestCase;