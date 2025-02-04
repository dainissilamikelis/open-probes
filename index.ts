import ProbeTestAction, { eProbeActionTypes, iActionProps } from "./src/actions";
import ChromeHelper from "./src/chromeHelpers";
import CPDWebSocketClient from "./src/connection";
import RedisMiddleware from "./src/middleware/redis";
import ProbeTestCase, { eProbeExecutor } from "./src/probeTestCase";
import PuppeteerConnector from "./src/puppeteer";

async function debug(): Promise<void> {
    
    try {
        // setup Redis to save data
        const redis = new RedisMiddleware(`redis://localhost:${process.env.redisPort}`)
        redis.connect();


        const action1 = new ProbeTestAction({
            command: eProbeActionTypes.goTo, 
            url: "https://www.1a.lv",
        })

        const action2 = new ProbeTestAction({
            command: eProbeActionTypes.waitForNavigation,
        })

        const chromeHelper = new  ChromeHelper();
        const debugInformation = await chromeHelper.extractJSONinformation();
        const pup = new PuppeteerConnector("test", debugInformation.webSocketDebuggerUrl, [action1, action2], redis)
        await pup.launchBrowser();
        await pup.execute();

        // const testCase1 = new ProbeTestCase(eProbeExecutor.web, redis, "testCase1", "google.com", [action1, action2])
        // await testCase1.execute();

        const resp = await redis.get("test1");
        console.log('Interaction complete. You can listen for network events or other events.');

        // Close after some time
    
    } catch (error) {
        console.error('Error interacting with CDP:', error);
    }
    console.log("test 123 123");
}

debug()