interface ConnllUFields {
    id: number;
    form: string;
    lemma?: string;
    upos?: string;
    xpos?: string;
    feats?: string;
    head?: number;
    deprel?: string;
    deps?: string;
    misc?: string;
}

class ConnllU {
    id: number;
    form?: string = undefined;
    lemma?: string = undefined;
    upos?: string = undefined;
    xpos?: string = undefined;
    feats?: string = undefined;
    head?: number = undefined;
    deprel?: string = undefined;
    deps?: string = undefined;
    misc?: string = undefined;

    constructor(props: ConnllUFields) {
        this.id = props.id;
        this.form = props.form;
        this.lemma = props.lemma;
        this.upos = props.upos;
        this.xpos = props.xpos;
        this.feats = props.feats;
        this.head  = props.head;
        this.deprel = props.deprel;
        this.deps = props.deps;
        this.misc = props.misc;
    }
}

export default ConnllU;