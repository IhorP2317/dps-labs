import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import {
    AbstractControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Button, ButtonDirective } from 'primeng/button';

import { PseudoRandomNumbers } from '../../core/interfaces/pseudo-random-numbers-sequence';
import { PseudoRandomNumbersEndpointService } from '../../shared/services/pseudo-random-numbers.endpoint.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
    selector: 'app-pseudo-random-number-generator',
    standalone: true,
    imports: [
        CardModule,
        InputNumberModule,
        ReactiveFormsModule,
        ButtonDirective,
        Button,
        InputTextareaModule,
    ],
    templateUrl: './pseudo-random-number-generator.component.html',
    styleUrl: './pseudo-random-number-generator.component.scss',
})
export class PseudoRandomNumberGeneratorComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    public sequence: PseudoRandomNumbers | null = null;
    public linearComparisonForm: FormGroup;
    constructor(
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly pseudoRandomNumbersService: PseudoRandomNumbersEndpointService,
        private readonly cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onSubmit() {
        if (this.linearComparisonForm.valid) {
            const formValues = this.linearComparisonForm.value;
            this.pseudoRandomNumbersService
                .getPseudoGeneratedNumbers(
                    formValues.m,
                    formValues.a,
                    formValues.c,
                    formValues.x0,
                    formValues.amount,
                )
                .pipe(
                    tap((numberSequence) => {
                        this.sequence = numberSequence;
                        this.cdr.detectChanges();
                    }),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe();
        } else {
            this.linearComparisonForm.markAllAsTouched();
        }
    }
    private initForm() {
        this.linearComparisonForm = this.formBuilder.group({
            m: this.formBuilder.control<number>(Math.pow(2, 24) - 1, [
                Validators.required,
                this.validateM(),
            ]),
            a: this.formBuilder.control<number>(Math.pow(11, 3), [
                Validators.required,
                this.validateA(),
            ]),
            c: this.formBuilder.control<number>(610, [
                Validators.required,
                this.validateC(),
            ]),
            x0: this.formBuilder.control<number>(9, [
                Validators.required,
                this.validateX0(),
            ]),
            amount: this.formBuilder.control<number>(9, [
                Validators.required,
                Validators.min(1),
                Validators.max(100),
            ]),
        });
    }

    private validateM() {
        return (control: AbstractControl): ValidationErrors | null => {
            const m = control.value;
            return m > 0 ? null : { invalidM: 'm must be greater than 0' };
        };
    }

    private validateA() {
        return (control: AbstractControl): ValidationErrors | null => {
            const a = control.value;
            const m = this.linearComparisonForm?.value.m;
            return a >= 0 && a < m
                ? null
                : { invalidA: 'a must be between 0 and m' };
        };
    }

    private validateC() {
        return (control: AbstractControl): ValidationErrors | null => {
            const c = control.value;
            const m = this.linearComparisonForm?.value.m;
            return c >= 0 && c < m
                ? null
                : { invalidC: 'c must be between 0 and m' };
        };
    }

    private validateX0() {
        return (control: AbstractControl): ValidationErrors | null => {
            const x0 = control.value;
            const m = this.linearComparisonForm?.value.m;
            return x0 >= 0 && x0 < m
                ? null
                : { invalidX0: 'x0 must be between 0 and m' };
        };
    }
}
