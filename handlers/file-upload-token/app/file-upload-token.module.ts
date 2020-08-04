import { NgModule }                                           from '@angular/core';
import { CommonModule }                                       from '@angular/common';
import { FileUploadTokenComponent }                                  from './file-upload-token.component';
import { HandlerFileUploadTokenBuilder }                             from '../common/file-upload-token.builder';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule }                                        from '@angular/forms';
import { JsfComponentsModule }                                from '@kalmia/jsf-app';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FileUploadModule
  ],
  declarations   : [FileUploadTokenComponent],
  exports        : [FileUploadTokenComponent]
})
export class FileUploadTokenModule {

  public static readonly entryComponent = FileUploadTokenComponent;
  public static readonly builder        = HandlerFileUploadTokenBuilder;

}
