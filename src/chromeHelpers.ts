import axios from "axios";

interface iChromeDebugInformation {
    description: string;
    devtoolsFrontendUrl:  string;
    id: string;
    title: string;
    type: string;
    url: string;
    webSocketDebuggerUrl: string;
}

class ChromeHelper {
    public async extractJSONinformation(): Promise<iChromeDebugInformation> {
        try {
            const resp = await axios.get(`http://localhost:${process.env.port}/json`);
            return resp.data[0];
        } catch(err) {
            throw new Error("Chrome debug URL not accessible");
        }
    }
}

export default ChromeHelper;