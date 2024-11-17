import { Component, OnInit } from '@angular/core';
import { DsaService } from '../../shared/services/dsa.service';
import {
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-dsa-signature',
    standalone: true,
    imports: [
        ButtonDirective,
        InputTextModule,
        PanelModule,
        ReactiveFormsModule,
    ],
    templateUrl: './dsa-signature.component.html',
    styleUrl: './dsa-signature.component.scss',
})
export class DsaSignatureComponent implements OnInit {
    private unsubscribe$ = new Subject<void>();
    dsaForm: FormGroup;
    constructor(
        private readonly dsaService: DsaService,
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }
    initForm(): void {
        this.dsaForm = this.formBuilder.group({
            inputFromStringGroup: this.formBuilder.group({
                inputString: this.formBuilder.control<string>(
                    '',
                    Validators.required,
                ),
            }),
            inputFromFileGroup: this.formBuilder.group({
                inputDataFileName: this.formBuilder.control<string>(
                    '',
                    Validators.required,
                ),
                inputSignFileName: this.formBuilder.control<string>(''),
            }),
            signatureResult: this.formBuilder.control<string>(''),
        });
    }
    onGetSignatureFromStringClick() {
        if (this.dsaForm.get('inputFromStringGroup')?.valid) {
            const inputString = this.dsaForm
                .get('inputFromStringGroup')
                ?.get('inputString')?.value;
            if (!!inputString) {
                this.dsaService
                    .getSignatureFromString(inputString)
                    .pipe(
                        tap((resultString) =>
                            this.dsaForm
                                .get('signatureResult')
                                ?.setValue(resultString),
                        ),
                        takeUntil(this.unsubscribe$),
                    )
                    .subscribe();
            }
        }
    }
    onGetSignatureFromFileClick() {
        if (this.dsaForm.get('inputFromFileGroup')?.valid) {
            const inputDataFileName = this.dsaForm
                .get('inputFromFileGroup')
                ?.get('inputDataFileName')?.value;
            if (!!inputDataFileName) {
                this.dsaService
                    .getSignatureFromFile(inputDataFileName)
                    .pipe(
                        tap((resultString) =>
                            this.dsaForm
                                .get('signatureResult')
                                ?.setValue(resultString),
                        ),
                        takeUntil(this.unsubscribe$),
                    )
                    .subscribe();
            }
        }
    }
    onFileSelected(event: Event, formControlName: string): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileControl = this.dsaForm
                .get('inputFromFileGroup')
                ?.get(formControlName);

            fileControl?.setValue(file.name);
            fileControl?.updateValueAndValidity();
            fileControl?.markAsTouched();
        }
    }
    onVerifySignatureClick(): void {
        if (this.dsaForm.get('inputFromFileGroup')?.valid) {
            const inputDataFileName = this.dsaForm
                .get('inputFromFileGroup')
                ?.get('inputDataFileName')?.value;
            const inputSignFileName = this.dsaForm
                .get('inputFromFileGroup')
                ?.get('inputSignFileName')?.value;
            if (!!inputDataFileName && !!inputSignFileName) {
                this.dsaService
                    .verifySignature(inputDataFileName, inputSignFileName)
                    .pipe(
                        tap((result) =>
                            result
                                ? this.messageService.add({
                                      severity: 'success',
                                      summary: 'File is verified!',
                                  })
                                : this.messageService.add({
                                      severity: 'error',
                                      summary: 'File is not verified!',
                                  }),
                        ),
                        takeUntil(this.unsubscribe$),
                    )
                    .subscribe();
            }
        }
    }
    saveToFile(content: string | null) {
        if (!!content) {
            const blob = new Blob([content.trim()], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'signature.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        }
    }
}
