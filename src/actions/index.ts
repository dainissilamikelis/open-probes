export enum eProbeActionTypes {
    waitForSelector,
    waitForNavigation,
    click,
    type,
    screenshot,
    evaluate,
    goTo = "Page.navigate",
    enable = "Page.enable"
}
export interface iActionProps {
    command: eProbeActionTypes;
    url?: string;
    selector?: string;
    maxExecution?: number;
}

class ProbeTestAction {
    properties: iActionProps;
    attributes: any;
    constructor(props: iActionProps) {
        this.properties = props;
        
        switch(props.command) {
            case eProbeActionTypes.goTo:
                this.attributes = { url : props.url }
                break;
            default:
                throw new Error("No command defined")
        }
    }
}

export default ProbeTestAction;



