import ProbeTestAction, { eProbeActionTypes } from "./src/actions";
import ProbeTestCase, { eProbeExecutor } from "./src/probeTestCase";

async function debug(): Promise<void> {
    
    try {
        const action1 = new ProbeTestAction(eProbeActionTypes.goTo, { url: "https://www.google.com" })

        const testCase1 = new ProbeTestCase(eProbeExecutor.web, "testCase1", "google.com", [action1])
        await testCase1.execute();

     
        console.log('Interaction complete. You can listen for network events or other events.');

        // Close after some time
    
    } catch (error) {
        console.error('Error interacting with CDP:', error);
    }
    console.log("test 123 123");
}

debug()