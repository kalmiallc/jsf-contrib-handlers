import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Optional, TemplateRef,
  ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { JsfPropBuilderString, JsfPropLayoutBuilder }                    from '@kalmia/jsf-common-es2015';
import { HandlerCodeEditorBuilder }                                      from '../common/code-editor.builder';
import { AbstractPropHandlerComponent, ShowValidationMessagesDirective } from '@kalmia/jsf-app';
import { Overlay, OverlayRef }                                           from '@angular/cdk/overlay';
import { TemplatePortal }                                                from '@angular/cdk/portal';
import { merge }                                                         from 'rxjs';
import { takeUntil }                                                     from 'rxjs/operators';


interface CodeEditorPreferences {
}

@Component({
  selector       : 'app-code-editor',
  template       : `
      <div class="handler-common-code-editor jsf-animatable rounded-sm"
           [ngClass]="layoutSchema?.htmlClass || ''">

          <div class="handler-common-code-editor-preview-area cursor-pointer" (click)="openCodeEditor()">
              <jsf-icon icon="fullscreen"></jsf-icon>
              <div class="handler-common-code-editor-content text-monospace text-pre-wrap no-text-selection">{{ value }}</div>
              <div class="handler-common-code-editor-overlay"></div>
          </div>
          
          <!-- Validation errors -->
          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>
    
    <ng-template #codeEditorTemplate>
        <div class="handler-common-code-editor-overlay-content" style="position: relative; width: 100%; height: 100%;">
            <ngx-monaco-editor [options]="editorOptions" [(ngModel)]="value" style="width: 100%; height: 100%;"></ngx-monaco-editor>
            <jsf-icon icon="close" class="cursor-pointer" (click)="closeCodeEditor()" style="position: absolute; top: 0; right: -30px;"></jsf-icon>
        </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['code-editor.component.scss'],
  encapsulation  : ViewEncapsulation.None
})
export class CodeEditorComponent extends AbstractPropHandlerComponent<JsfPropBuilderString, HandlerCodeEditorBuilder> implements OnInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

  @ViewChild('codeEditorTemplate', { read: TemplateRef, static: false })
  codeEditorTemplate: TemplateRef<any>;

  public editorOptions;

  private overlayRef: OverlayRef;

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective,
              protected vcRef: ViewContainerRef,
              protected overlay: Overlay) {
    super(cdRef, showValidation);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.editorOptions = {
      theme: 'vs-dark',
      language: this.handlerBuilder.language,
      automaticLayout: true
    };
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public openCodeEditor() {
    this.overlayRef = this.overlay.create({
      // Position strategy defines where popup will be displayed
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      // Popup reposition on scroll
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),

      hasBackdrop     : true,
      width: '80vw',
      height: '90vh'
    });

    // Put template to a portal
    const templatePortal = new TemplatePortal(this.codeEditorTemplate, this.vcRef);

    // Attach the portal to the overlay
    this.overlayRef.attach(templatePortal);

    // Handle closing
    merge(
      this.overlayRef.backdropClick(),
      this.overlayRef.detachments()
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.overlayRef.dispose();
      });
  }

  public closeCodeEditor() {
    this.overlayRef.dispose();
  }


  get handlerPreferences(): CodeEditorPreferences {
    return {
      /* Defaults */

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as CodeEditorPreferences;
  }
}
