import ProbeTestAction, { eProbeActionTypes, iActionProps } from "./src/actions";
import RedisMiddleware from "./src/middleware/redis";
import ProbeTestCase, { eProbeExecutor } from "./src/probeTestCase";

async function debug(): Promise<void> {
    
    try {
        // setup Redis to save data
        const redis = new RedisMiddleware(`redis://localhost:${process.env.redisPort}`)
        redis.connect();


        const action1 = new ProbeTestAction({
            command: eProbeActionTypes.goTo, 
            url: "https://www.1a.lv",
        })
        const testCase1 = new ProbeTestCase(eProbeExecutor.web, redis, "testCase1", "google.com", [action1])
        
        
        await testCase1.execute();

        const resp = await redis.get("test1");
        console.log('Interaction complete. You can listen for network events or other events.');

        // Close after some time
    
    } catch (error) {
        console.error('Error interacting with CDP:', error);
    }
    console.log("test 123 123");
}

debug()