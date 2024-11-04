import { KeyLengthInBytesRc5Enum } from '../enums/KeyLengthInBytesRc5Enum';
import { WordLengthInBitsEnum } from '../enums/WordLengthInBitsEnum';
import { RoundCountEnum } from '../enums/RoundCountEnum';

export interface RC5Settings {
    roundCount: RoundCountEnum;
    wordLengthInBits: WordLengthInBitsEnum;
    keyLengthInBytes: KeyLengthInBytesRc5Enum;
}
