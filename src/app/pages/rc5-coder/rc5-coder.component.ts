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
import { KeyLengthInBytesEnum } from '../../core/enums/KeyLengthInBytesEnum';
import { nonEmptyValidator } from '../../shared/validators/non-empty.validator';
import { RC5Settings } from '../../core/interfaces/RC5Settings';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import {
    KEY_LENGTH_OPTIONS,
    ROUND_COUNT_OPTIONS,
    WORD_LENGTH_OPTIONS,
} from '../../shared/constants/dropdown.constants';

@Component({
    selector: 'app-rc5-coder',
    standalone: true,
    imports: [
        ButtonDirective,
        InputTextModule,
        PaginatorModule,
        PanelModule,
        ReactiveFormsModule,
    ],
    templateUrl: './rc5-coder.component.html',
    styleUrl: './rc5-coder.component.scss',
})
export class Rc5CoderComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    rc5Form: FormGroup;
    resultFilePath: string;
    constructor(
        private readonly formBuilder: NonNullableFormBuilder,
        private readonly rc5Service: Rc5Service,
        private readonly messageService: MessageService,
    ) {}
    ngOnInit(): void {
        this.initForm();
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    initForm() {
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
            keyLengthInBytes: this.formBuilder.control<KeyLengthInBytesEnum>(
                KeyLengthInBytesEnum.Bytes_16,
                Validators.required,
            ),
        });
    }
    onFileSelected(event: Event, formControlName: string): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            this.rc5Form?.get(formControlName)?.setValue(file.name);
        }
    }
    onRc5FormSubmit(isEncrypting: boolean): void {
        if (this.rc5Form.valid) {
            const rc5settings = {
                roundCount: this.rc5Form.get('roundCount')?.value.value,
                wordLengthInBits:
                    this.rc5Form.get('wordLengthInBits')?.value.value,
                keyLengthInBytes:
                    this.rc5Form.get('keyLengthInBytes')?.value.value,
            } as RC5Settings;
            console.log('RC5 Settings:', rc5settings);
            const serviceMethod = isEncrypting
                ? this.rc5Service.encode(
                      this.rc5Form.get('key')?.value,
                      this.rc5Form.get('fileName')?.value,
                      rc5settings,
                  )
                : this.rc5Service.decode(
                      this.rc5Form.get('key')?.value,
                      this.rc5Form.get('fileName')?.value,
                      rc5settings,
                  );
            serviceMethod
                .pipe(
                    tap((resultFileName) => {
                        this.resultFilePath = resultFileName;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successfully completed!',
                            detail: `Result is saved to ${this.resultFilePath}!`,
                        });
                    }),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe();
        }
    }

    protected readonly WordLengthInBitsEnum = WordLengthInBitsEnum;
    protected readonly WORD_LENGTH_OPTIONS = WORD_LENGTH_OPTIONS;
    protected readonly ROUND_COUNT_OPTIONS = ROUND_COUNT_OPTIONS;
    protected readonly KEY_LENGTH_OPTIONS = KEY_LENGTH_OPTIONS;
}
