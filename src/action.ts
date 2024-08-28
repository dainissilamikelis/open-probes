enum eProbeActionTypes {
    waitForSelector,
    waitForNavigation,
    click,
    type,
    screenshot,
    evaluate,
    goTo,
}

export default class ProbeTestAction {
    actionType: eProbeActionTypes;
    constructor(actionType: eProbeActionTypes) {
        this.actionType = actionType;
    }
}



