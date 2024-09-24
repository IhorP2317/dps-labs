import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HashComparisonResult } from '../../core/interfaces/hash-comparison-result';

@Injectable({
    providedIn: 'root',
})
export class HashService {
    private apiUrl = 'https://localhost:7013/';

    constructor(private readonly http: HttpClient) {}

    getHashFromString(input: string): Observable<string> {
        let params = new HttpParams();
        params = params.set('input', input);
        return this.http.get<string>(this.apiUrl + 'hash-string', { params });
    }

    getHashFromFile(input: string): Observable<string> {
        let params = new HttpParams().set('filePath', input);

        return this.http.post<string>(this.apiUrl + 'hash-file', null, {
            params,
        });
    }

    getHashComparisonFromString(
        input: string,
        md5FilePath: string,
    ): Observable<HashComparisonResult> {
        let params = new HttpParams();
        params = params.set('input', input);
        params = params.set('md5FilePath', md5FilePath);
        return this.http.get<HashComparisonResult>(
            this.apiUrl + 'check-with-hash-string',
            { params },
        );
    }

    getHashComparisonFromFile(
        input: string,
        md5FilePath: string,
    ): Observable<HashComparisonResult> {
        let params = new HttpParams();
        params = params.set('filePath', input);
        params = params.set('md5FilePath', md5FilePath);
        return this.http.post<HashComparisonResult>(
            this.apiUrl + 'check-with-hash-file',
            null,
            { params },
        );
    }
}
