import Action from "./Action";

interface Service {
    name: string;
    actions: [Action];
    reactions: [Action];
}

export default Service;
