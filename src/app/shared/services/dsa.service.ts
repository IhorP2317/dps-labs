import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DsaService {
    constructor(
        private readonly http: HttpClient,
        @Inject('apiUrl') private apiUrl: string,
    ) {}
    getSignatureFromString(input: string): Observable<string> {
        let params = new HttpParams();
        params = params.set('input', input);
        return this.http.get<string>(this.apiUrl + 'dsa/sign-string', {
            params,
        });
    }
    getSignatureFromFile(fileName: string): Observable<string> {
        let params = new HttpParams();
        params = params.set('fileName', fileName);
        return this.http.get<string>(this.apiUrl + 'dsa/sign-file', { params });
    }
    verifySignature(
        dataFileName: string,
        signFileName: string,
    ): Observable<boolean> {
        let params = new HttpParams();
        params = params.set('dataFileName', dataFileName);
        params = params.set('signFileName', signFileName);
        return this.http.get<boolean>(this.apiUrl + 'dsa/verify', { params });
    }
}
