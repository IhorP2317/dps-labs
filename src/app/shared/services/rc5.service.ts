import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RC5Settings } from '../../core/interfaces/RC5Settings';

@Injectable({
    providedIn: 'root',
})
export class Rc5Service {
    constructor(
        private readonly http: HttpClient,
        @Inject('apiUrl') private apiUrl: string,
    ) {}
    encode(key: string, fileName: string, rc5Settings: RC5Settings) {
        let params = new HttpParams();
        params = params.set('key', key);
        params = params.set('fileName', fileName);
        return this.http.post<string>(this.apiUrl + 'rc5/encode', rc5Settings, {
            params,
        });
    }
    decode(key: string, fileName: string, rc5Settings: RC5Settings) {
        let params = new HttpParams();
        params = params.set('key', key);
        params = params.set('fileName', fileName);
        return this.http.post<string>(this.apiUrl + 'rc5/decode', rc5Settings, {
            params,
        });
    }
}
