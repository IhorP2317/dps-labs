import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PseudoRandomNumbers } from '../../core/interfaces/pseudo-random-numbers-sequence';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PseudoRandomNumbersEndpointService {
    constructor(private http: HttpClient) {}
    public getPseudoGeneratedNumbers(
        m: number,
        a: number,
        c: number,
        X0: number,
        amount: number,
    ): Observable<PseudoRandomNumbers> {
        let params = new HttpParams();
        params = params.set('a', a);
        params = params.set('x0', X0);
        params = params.set('c', c);
        params = params.set('m', m);
        params = params.set('sequenceLength', amount);
        return this.http.get<PseudoRandomNumbers>(
            'https://localhost:7013/pseudo-random-numbers',
            { params },
        );
    }
}
