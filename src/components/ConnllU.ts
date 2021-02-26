interface ConnllUFields {
    id: number;
    form: string;
    lemma?: string;
    upos?: string;
    xpos?: string;
    feats?: string;
    head?: string;
    deprel?: string;
    deps?: string;
    misc?: string;
}

class ConnllU {
    id: number;
    form: string;
    lemma: string;
    upos: string = '';
    xpos: string = '';
    feats: string = '';
    head: string = '';
    deprel: string = '';
    deps: string = '';
    misc: string = '';

    constructor(props: ConnllUFields) {
        this.id = props.id;
        this.form = props.form;
        this.lemma = props.form;

        // if (props.form === 'Drop') {
        //     this.upos = 'VERB';
        //     this.xpos = 'VB';
        //     this.feats = 'VerbForm=Inf';
        // } else if (props.form === 'the') {
        //     this.upos = 'DET';
        //     this.xpos = 'DT';
        //     this.feats = 'Definite=Def|PronType=Art';
        // } else if (props.form === 'mic') {
        //     this.upos = 'NOUN';
        //     this.xpos = 'NN';
        //     this.feats = 'Number=Sing';
        // }

    }
}

export default ConnllU;