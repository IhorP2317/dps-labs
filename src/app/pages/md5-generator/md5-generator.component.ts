import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import {
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Subject, takeUntil, tap } from 'rxjs';
import { PseudoRandomNumbers } from '../../core/interfaces/pseudo-random-numbers-sequence';
import { PseudoRandomNumbersEndpointService } from '../../shared/services/pseudo-random-numbers.endpoint.service';
import { HashService } from '../../shared/services/hash.service';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { HashComparisonResult } from '../../core/interfaces/hash-comparison-result';

@Component({
    selector: 'app-md5-generator',
    standalone: true,
    imports: [
        ButtonDirective,
        FormsModule,
        InputNumberModule,
        InputTextareaModule,
        ReactiveFormsModule,
        InputTextModule,
        PanelModule,
    ],
    templateUrl: './md5-generator.component.html',
    styleUrl: './md5-generator.component.scss',
})
export class Md5GeneratorComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    public md5ResultString: string = '';
    public md5ResultStringComparison: HashComparisonResult;
    public md5ResultFileName: string = '';
    public md5ResultFileNameComparison: HashComparisonResult;
    public hashFormGroup: FormGroup;
    constructor(
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly cdr: ChangeDetectorRef,
        private readonly hashService: HashService,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    initForm(): void {
        this.hashFormGroup = this.formBuilder.group({
            inputGroup: this.formBuilder.group({
                inputString: this.formBuilder.control<string>(
                    '',
                    Validators.required,
                ),
                md5FilePath: this.formBuilder.control<string>(''),
            }),
            fileGroup: this.formBuilder.group({
                filePath: this.formBuilder.control<string>(
                    '',
                    Validators.required,
                ),
                md5FilePath: this.formBuilder.control<string>(''),
            }),
        });
    }
    onFileSelected(
        event: Event,
        formGroupName: string,
        formControlName: string,
    ): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            this.hashFormGroup
                .get(formGroupName)
                ?.get(formControlName)
                ?.setValue(file.name);
        }
    }
    onInputFormSubmit() {
        if (this.hashFormGroup.get('inputGroup')?.valid) {
            this.hashService
                .getHashFromString(
                    this.hashFormGroup.get('inputGroup.inputString')?.value,
                )
                .pipe(
                    tap((result) => (this.md5ResultString = result)),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe();
        }
    }
    onFileFormSubmit() {
        if (this.hashFormGroup.get('fileGroup')?.valid) {
            this.hashService
                .getHashFromFile(
                    this.hashFormGroup.get('fileGroup.filePath')?.value,
                )
                .pipe(
                    tap((result) => (this.md5ResultFileName = result)),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe();
        }
    }
    getComparisonFromString() {
        this.hashService
            .getHashComparisonFromString(
                this.hashFormGroup.get('inputGroup.inputString')?.value,
                this.hashFormGroup.get('inputGroup.md5FilePath')?.value,
            )
            .pipe(
                tap(
                    (result: HashComparisonResult) =>
                        (this.md5ResultStringComparison = result),
                ),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }
    getComparisonFromFile() {
        this.hashService
            .getHashComparisonFromFile(
                this.hashFormGroup.get('fileGroup.filePath')?.value,
                this.hashFormGroup.get('fileGroup.md5FilePath')?.value,
            )
            .pipe(
                tap(
                    (result: HashComparisonResult) =>
                        (this.md5ResultFileNameComparison = result),
                ),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }
}
