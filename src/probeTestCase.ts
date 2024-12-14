import ProbeTestAction, { eProbeActionTypes } from "./action";
import ChromeHelper from "./chromeHelpers";
import CPDWebSocketClient from "./connection";

export enum eProbeExecutor {
    web,
    api,
}

class ProbeTestCase {
    executor: eProbeExecutor;
    testCaseName: string;
    url: string;
    actions: ProbeTestAction[] = [];
    private client: CPDWebSocketClient;
    constructor(executor: eProbeExecutor, testCaseName: string, url: string, actions: ProbeTestAction[]) {
        this.executor = executor;
        this.testCaseName = testCaseName;
        this.url = url;
        this.actions = actions;
        
    }

    async execute() {    
        try {
            await this.establishConnection();
            console.log(`Executing test case: ${this.testCaseName}`);
            for(const action of this.actions) {
                console.log(`EXECUTING ACTION ${action.properties.command}`)
                await this.client.sendCommand(action.properties.command as string, action.properties.attributes);
            }
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