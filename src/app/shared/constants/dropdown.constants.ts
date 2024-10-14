import { WordLengthInBitsEnum } from '../../core/enums/WordLengthInBitsEnum';
import { RoundCountEnum } from '../../core/enums/RoundCountEnum';
import { KeyLengthInBytesEnum } from '../../core/enums/KeyLengthInBytesEnum';

export const WORD_LENGTH_OPTIONS = [
    { name: '16-bit', value: WordLengthInBitsEnum.Bit16 },
    { name: '32-bit', value: WordLengthInBitsEnum.Bit32 },
    { name: '64-bit', value: WordLengthInBitsEnum.Bit64 },
];
export const ROUND_COUNT_OPTIONS = [
    { name: '8 Rounds', value: RoundCountEnum.Rounds_8 },
    { name: '12 Rounds', value: RoundCountEnum.Rounds_12 },
    { name: '16 Rounds', value: RoundCountEnum.Rounds_16 },
    { name: '20 Rounds', value: RoundCountEnum.Rounds_20 },
];
export const KEY_LENGTH_OPTIONS = [
    { name: '8 Bytes', value: KeyLengthInBytesEnum.Bytes_8 },
    { name: '16 Bytes', value: KeyLengthInBytesEnum.Bytes_16 },
    { name: '32 Bytes', value: KeyLengthInBytesEnum.Bytes_32 },
];
