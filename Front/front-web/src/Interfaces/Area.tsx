import Action from "./Action";

interface Area {
    name: String;
    description: String;
    service: String;
    Action: [Action];
    Reaction: [Action];
    isActive: boolean;
    isDone: boolean;
}

export default Area;
