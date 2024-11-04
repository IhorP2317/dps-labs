import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Rc5Service } from '../../shared/services/rc5.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { WordLengthInBitsEnum } from '../../core/enums/WordLengthInBitsEnum';
import { RoundCountEnum } from '../../core/enums/RoundCountEnum';
import { KeyLengthInBytesRc5Enum } from '../../core/enums/KeyLengthInBytesRc5Enum';
import { nonEmptyValidator } from '../../shared/validators/non-empty.validator';
import { RC5Settings } from '../../core/interfaces/RC5Settings';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import {
    RC5_KEY_LENGTH_OPTIONS,
    ROUND_COUNT_OPTIONS,
    RSA_KEY_LENGTH_OPTIONS,
    WORD_LENGTH_OPTIONS,
} from '../../shared/constants/dropdown.constants';
import { CryptoResponse } from '../../core/interfaces/CryptoResponse';
import { RsaService } from '../../shared/services/rsa.service';
import { KeyLengthInBytesRSAEnum } from '../../core/enums/KeyLengthInBytesRsaEnum';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-file-coder',
    standalone: true,
    imports: [
        ButtonDirective,
        InputTextModule,
        PaginatorModule,
        PanelModule,
        ReactiveFormsModule,
        TableModule,
    ],
    templateUrl: './file-coder.component.html',
    styleUrl: './file-coder.component.scss',
})
export class FileCoderComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    rc5Form: FormGroup;
    rsaForm: FormGroup;
    rc5EncryptionResponses: CryptoResponse[] = [];
    rsaEncryptionResponses: CryptoResponse[] = [];
    rc5DecryptionResponses: CryptoResponse[] = [];
    rsaDecryptionResponses: CryptoResponse[] = [];
    get encryptionResponses() {
        return [
            ...this.rc5EncryptionResponses.map((res) => ({
                ...res,
                algorithm: 'RC5',
            })),
            ...this.rsaEncryptionResponses.map((res) => ({
                ...res,
                algorithm: 'RSA',
            })),
        ];
    }

    get decryptionResponses() {
        return [
            ...this.rc5DecryptionResponses.map((res) => ({
                ...res,
                algorithm: 'RC5',
            })),
            ...this.rsaDecryptionResponses.map((res) => ({
                ...res,
                algorithm: 'RSA',
            })),
        ];
    }
    constructor(
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly rc5Service: Rc5Service,
        private readonly rsaService: RsaService,
        private readonly messageService: MessageService,
    ) {}
    ngOnInit(): void {
        this.initRc5Form();
        this.initRsaForm();
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    initRc5Form() {
        this.rc5Form = this.formBuilder.group({
            key: this.formBuilder.control<string>('', [
                Validators.required,
                nonEmptyValidator(),
            ]),
            fileName: this.formBuilder.control<string>('', Validators.required),
            wordSizeInBits: this.formBuilder.control<WordLengthInBitsEnum>(
                WordLengthInBitsEnum.Bit64,
                Validators.required,
            ),
            roundCount: this.formBuilder.control<RoundCountEnum>(
                RoundCountEnum.Rounds_16,
                Validators.required,
            ),
            keyLengthInBytes: this.formBuilder.control<KeyLengthInBytesRc5Enum>(
                KeyLengthInBytesRc5Enum.Bytes_16,
                Validators.required,
            ),
        });
    }
    initRsaForm() {
        this.rsaForm = this.formBuilder.group({
            fileName: this.formBuilder.control<string>('', Validators.required),
            keyLengthInBytesRSA:
                this.formBuilder.control<KeyLengthInBytesRSAEnum>(
                    KeyLengthInBytesRSAEnum.Bytes_48,
                    Validators.required,
                ),
        });

        this.rsaService
            .getCurrentKeySize()
            .pipe(
                tap((keyLengthInBytes) => {
                    if (keyLengthInBytes) {
                        this.rsaForm
                            .get('keyLengthInBytesRSA')
                            ?.setValue(keyLengthInBytes);
                    }
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    onFileSelected(
        event: Event,
        form: FormGroup,
        formControlName: string,
    ): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileControl = form.get(formControlName);

            fileControl?.setValue(file.name);
            fileControl?.updateValueAndValidity();

            fileControl?.markAsTouched();
        }
    }
    onImportFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            this.rsaService
                .importKey(file)
                .pipe(
                    tap((importKeyResponse) => {
                        this.messageService.add({
                            severity:
                                importKeyResponse.hasPrivateKey ||
                                importKeyResponse.hasPublicKey
                                    ? 'success'
                                    : 'error',
                            summary: 'Key imported!',
                            detail: `${importKeyResponse.message}`,
                        });
                    }),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe();
        }
    }
    onExportKeySelected(includePrivatePart: boolean): void {
        this.rsaService
            .exportKey(includePrivatePart)
            .pipe(
                tap((keyFile) => {
                    const contentDisposition = keyFile.headers.get(
                        'content-disposition',
                    );
                    let filename = includePrivatePart
                        ? 'privateKey.xml'
                        : 'publicKey.xml';
                    if (contentDisposition) {
                        const matches = /filename="?([^"]+)"?/.exec(
                            contentDisposition,
                        );
                        if (matches && matches[1]) {
                            filename = matches[1];
                        }
                    }

                    const blob = keyFile.body;
                    const url = window.URL.createObjectURL(blob!);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    onRc5FormSubmit(isEncrypting: boolean): void {
        if (this.rc5Form.valid) {
            const rc5settings = {
                roundCount: this.rc5Form.get('roundCount')?.value.value,
                wordLengthInBits:
                    this.rc5Form.get('wordSizeInBits')?.value.value,
                keyLengthInBytes:
                    this.rc5Form.get('keyLengthInBytes')?.value.value,
            } as RC5Settings;
            const serviceMethod = isEncrypting
                ? this.rc5Service
                      .encode(
                          this.rc5Form.get('key')?.value,
                          this.rc5Form.get('fileName')?.value,
                          rc5settings,
                      )
                      .pipe(
                          tap((response) => {
                              this.rc5EncryptionResponses.push(response);
                              this.messageService.add({
                                  severity: 'success',
                                  summary: 'Successfully encrypted!',
                                  detail: `Result is saved to ${response.resultFileName}!`,
                              });
                          }),
                      )
                : this.rc5Service
                      .decode(
                          this.rc5Form.get('key')?.value,
                          this.rc5Form.get('fileName')?.value,
                          rc5settings,
                      )
                      .pipe(
                          tap((response) => {
                              this.rc5DecryptionResponses.push(response);
                              this.messageService.add({
                                  severity: 'success',
                                  summary: 'Successfully decrypted!',
                                  detail: `Result is saved to ${response.resultFileName}!`,
                              });
                          }),
                      );
            serviceMethod.pipe(takeUntil(this.unsubscribe$)).subscribe();
        }
    }
    onGenerateNewKeyPair() {
        if (this.rsaForm.get('keyLengthInBytesRSA')?.value) {
            this.rsaService
                .generateNewKeyPair(
                    this.rsaForm.get('keyLengthInBytesRSA')?.value,
                )
                .pipe(
                    tap(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successfully generated Key!',
                            detail: `New size of Key is ${this.rsaForm.get('keyLengthInBytesRSA')?.value} bytes!`,
                        });
                    }),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe();
        }
    }
    onRsaFormSubmit(isEncrypting: boolean) {
        if (this.rsaForm.valid) {
            const serviceMethod = isEncrypting
                ? this.rsaService
                      .encode(this.rsaForm.get('fileName')?.value)
                      .pipe(
                          tap((response) => {
                              this.rsaEncryptionResponses.push(response);
                              this.messageService.add({
                                  severity: 'success',
                                  summary: 'Successfully encrypted!',
                                  detail: `Result is saved to ${response.resultFileName}!`,
                              });
                          }),
                      )
                : this.rsaService
                      .decode(this.rsaForm.get('fileName')?.value)
                      .pipe(
                          tap((response) => {
                              this.rsaDecryptionResponses.push(response);
                              this.messageService.add({
                                  severity: 'success',
                                  summary: 'Successfully decrypted!',
                                  detail: `Result is saved to ${response.resultFileName}!`,
                              });
                          }),
                      );
            serviceMethod.pipe(takeUntil(this.unsubscribe$)).subscribe();
        }
    }

    protected readonly WordLengthInBitsEnum = WordLengthInBitsEnum;
    protected readonly WORD_LENGTH_OPTIONS = WORD_LENGTH_OPTIONS;
    protected readonly ROUND_COUNT_OPTIONS = ROUND_COUNT_OPTIONS;
    protected readonly RC5_KEY_LENGTH_OPTIONS = RC5_KEY_LENGTH_OPTIONS;
    protected readonly RSA_KEY_LENGTH_OPTIONS = RSA_KEY_LENGTH_OPTIONS;
}
