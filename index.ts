import ChromeHelper from "./src/chromeHelpers";
import CDPWebSocketClient from "./src/connection";

async function debug(): Promise<void> {
    const chromeHelper = new ChromeHelper();
    const debugInformation = await chromeHelper.extractJSONinformation();
    const client = new CDPWebSocketClient(debugInformation.webSocketDebuggerUrl);
    try {
      


        await client.sendCommand('Page.enable');
        const result = await client.sendCommand('Page.navigate', {
            url: 'https://google.com',
        });


        console.log('Interaction complete. You can listen for network events or other events.');

        // Close after some time
    
    } catch (error) {
        console.error('Error interacting with CDP:', error);
    } finally {
        client.close();
    }
    console.log("test 123 123");
}

debug()