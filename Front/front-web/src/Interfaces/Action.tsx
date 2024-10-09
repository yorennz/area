interface Action {
    name: string;
    description: string;
    data: {
        [key: string]: string;
    };
}

export default Action;
