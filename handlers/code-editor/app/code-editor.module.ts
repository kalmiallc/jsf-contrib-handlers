import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { CodeEditorComponent }      from './code-editor.component';
import { HandlerCodeEditorBuilder } from '../common/code-editor.builder';
import { FormsModule }              from '@angular/forms';
import { JsfComponentsModule }      from '@kalmia/jsf-app';
import { CodemirrorModule }         from '@ctrl/ngx-codemirror';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    CodemirrorModule
  ],
  declarations: [CodeEditorComponent],
  exports     : [CodeEditorComponent]
})
export class CodeEditorModule {

  public static readonly entryComponent = CodeEditorComponent;
  public static readonly builder        = HandlerCodeEditorBuilder;

}
