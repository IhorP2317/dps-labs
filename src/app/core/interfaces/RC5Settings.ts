import { KeyLengthInBytesEnum } from '../enums/KeyLengthInBytesEnum';
import { WordLengthInBitsEnum } from '../enums/WordLengthInBitsEnum';
import { RoundCountEnum } from '../enums/RoundCountEnum';

export interface RC5Settings {
    roundCount: RoundCountEnum;
    wordLengthInBits: WordLengthInBitsEnum;
    keyLengthInBytes: KeyLengthInBytesEnum;
}
