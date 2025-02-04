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
    attributes: any; // for now lets leave as any as it might change
}

class ProbeTestAction {
    properties: iActionProps;
    constructor(actionType: eProbeActionTypes, attributes: any) {
        this.properties = {
            command: actionType,
            attributes,
        }
    }

}

export default ProbeTestAction;



