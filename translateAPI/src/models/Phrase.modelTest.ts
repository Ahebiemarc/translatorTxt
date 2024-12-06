import {Schema, model, Document} from 'mongoose';


const phraseSchema = new Schema({
    Arabizi: {type: String, required: true, unique: true},
    French: {type: String, default: ""},
});


interface IPhrase extends Document{
    Arabizi: string;
    French: string;
}

const PhraseT = model<IPhrase>("PhraseTest", phraseSchema);

export default PhraseT;