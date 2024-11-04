import { WordLengthInBitsEnum } from '../../core/enums/WordLengthInBitsEnum';
import { RoundCountEnum } from '../../core/enums/RoundCountEnum';
import { KeyLengthInBytesRc5Enum } from '../../core/enums/KeyLengthInBytesRc5Enum';
import { KeyLengthInBytesRSAEnum } from '../../core/enums/KeyLengthInBytesRsaEnum';

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
export const RC5_KEY_LENGTH_OPTIONS = [
    { name: '8 Bytes', value: KeyLengthInBytesRc5Enum.Bytes_8 },
    { name: '16 Bytes', value: KeyLengthInBytesRc5Enum.Bytes_16 },
    { name: '32 Bytes', value: KeyLengthInBytesRc5Enum.Bytes_32 },
];
export const RSA_KEY_LENGTH_OPTIONS = [
    { name: '48 Bytes', value: KeyLengthInBytesRSAEnum.Bytes_48 },
    { name: '64 Bytes', value: KeyLengthInBytesRSAEnum.Bytes_64 },
    { name: '128 Bytes', value: KeyLengthInBytesRSAEnum.Bytes_128 },
    { name: '256 Bytes', value: KeyLengthInBytesRSAEnum.Bytes_256 },
    { name: '384 Bytes', value: KeyLengthInBytesRSAEnum.Bytes_384 },
    { name: '512 Bytes', value: KeyLengthInBytesRSAEnum.Bytes_512 },
];
