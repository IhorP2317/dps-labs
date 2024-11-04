import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportKeyResponse } from '../../core/interfaces/ImportKeyResponse';
import { KeyLengthInBytesRSAEnum } from '../../core/enums/KeyLengthInBytesRsaEnum';
import { CryptoResponse } from '../../core/interfaces/CryptoResponse';

@Injectable({
    providedIn: 'root',
})
export class RsaService {
    constructor(
        private readonly http: HttpClient,
        @Inject('apiUrl') private apiUrl: string,
    ) {}
    importKey(keyFile: File): Observable<ImportKeyResponse> {
        const formData = new FormData();
        formData.append('keyFile', keyFile, keyFile.name);
        return this.http.post<ImportKeyResponse>(
            `${this.apiUrl}rsa/import-key`,
            formData,
        );
    }
    generateNewKeyPair(keyLength: KeyLengthInBytesRSAEnum) {
        let params = new HttpParams();
        params = params.set('keyLength', keyLength);
        return this.http.post<void>(
            `${this.apiUrl}rsa/generate-keys`,
            {},
            { params },
        );
    }
    exportKey(includePrivateKey: boolean = false) {
        const url = `${this.apiUrl}rsa/export-key?includePrivateKey=${includePrivateKey}`;

        return this.http.get(url, {
            responseType: 'blob',
            observe: 'response',
        });
    }
    getCurrentKeySize() {
        return this.http.get<KeyLengthInBytesRSAEnum>(
            `${this.apiUrl}rsa/get-key-size`,
        );
    }
    encode(fileName: string) {
        let params = new HttpParams();
        params = params.set('fileName', fileName);
        return this.http.post<CryptoResponse>(
            `${this.apiUrl}rsa/encode`,
            {},
            { params },
        );
    }
    decode(fileName: string) {
        let params = new HttpParams();
        params = params.set('fileName', fileName);
        return this.http.post<CryptoResponse>(
            `${this.apiUrl}rsa/decode`,
            {},
            { params },
        );
    }
}
