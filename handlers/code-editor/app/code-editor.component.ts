import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import {
  JsfPropBuilderString,
  JsfPropLayoutBuilder
}                                                                                                            from '@kalmia/jsf-common-es2015';
import { HandlerCodeEditorBuilder }                                                                          from '../common/code-editor.builder';
import { AbstractPropHandlerComponent, ShowValidationMessagesDirective }                                     from '@kalmia/jsf-app';


interface CodeEditorPreferences {
}

@Component({
  selector       : 'app-code-editor',
  template       : `
      <div class="handler-common-code-editor jsf-animatable rounded-sm"
           [ngClass]="layoutSchema?.htmlClass || ''">

          <!-- Code editor -->
          <jsf-code-editor [language]="handlerBuilder.language" [(ngModel)]="value"></jsf-code-editor>

          <!-- Validation errors -->
          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['code-editor.component.scss'],
  encapsulation  : ViewEncapsulation.None
})
export class CodeEditorComponent extends AbstractPropHandlerComponent<JsfPropBuilderString, HandlerCodeEditorBuilder> implements OnInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  get handlerPreferences(): CodeEditorPreferences {
    return {
      /* Defaults */

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as CodeEditorPreferences;
  }
}
