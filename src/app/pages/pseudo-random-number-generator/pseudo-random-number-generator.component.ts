import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { generateRandomNumbers } from '../../core/utils/linear-comparison-algorithm';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonDirective } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-pseudo-random-number-generator',
    standalone: true,
    imports: [
        CardModule,
        InputNumberModule,
        ReactiveFormsModule,
        ButtonDirective,
        NgIf,
    ],
    templateUrl: './pseudo-random-number-generator.component.html',
    styleUrl: './pseudo-random-number-generator.component.scss',
})
export class PseudoRandomNumberGeneratorComponent implements OnInit {
    public sequenceOfNumbers: number[];

    public linearComparisonForm: FormGroup;
    constructor(private formBuilder: FormBuilder) {}
    ngOnInit(): void {
        this.initForm();
    }
    private initForm() {
        this.linearComparisonForm = this.formBuilder.group({
            m: this.formBuilder.control<number | null>(Math.pow(2, 24) - 1, [
                Validators.required,
                this.validateM(),
            ]),
            a: this.formBuilder.control<number | null>(Math.pow(11, 3), [
                Validators.required,
                this.validateA(),
            ]),
            c: this.formBuilder.control<number | null>(610, [
                Validators.required,
                this.validateC(),
            ]),
            x0: this.formBuilder.control<number | null>(9, [
                Validators.required,
                this.validateX0(),
            ]),
            amount: this.formBuilder.control<number | null>(9, [
                Validators.required,
                Validators.min(1),
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
    onSubmit() {
        if (this.linearComparisonForm.valid) {
            this.sequenceOfNumbers = generateRandomNumbers(
                this.linearComparisonForm.value.m,
                this.linearComparisonForm.value.a,
                this.linearComparisonForm.value.c,
                this.linearComparisonForm.value.x0,
                this.linearComparisonForm.value.amount,
            );
        }
    }
}
