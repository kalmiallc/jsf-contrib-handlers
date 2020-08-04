import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { JsfPropBuilderString, JsfPropLayoutBuilder }                           from '@kalmia/jsf-common-es2015';
import { HandlerCodeEditorBuilder }                                             from '../common/code-editor.builder';
import { AbstractPropHandlerComponent }                                         from '@kalmia/jsf-app';
// Modes
import 'codemirror/mode/javascript/javascript';
// Addons
import 'codemirror/addon/dialog/dialog';

import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/match-highlighter';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closetag';

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';

import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/sql-hint';

import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/css-lint';

import 'codemirror/addon/selection/mark-selection';

import 'codemirror/addon/comment/continuecomment';

import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/scroll/simplescrollbars';


interface CodeEditorPreferences {
}

@Component({
  selector       : 'app-code-editor',
  template       : `
      <div class="handler-common-code-editor jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''">

          <ngx-codemirror [(ngModel)]="value"
                          [options]="editorOptions">
          </ngx-codemirror>

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

  public editorOptions;

  public ngOnInit(): void {
    super.ngOnInit();

    this.editorOptions = {
      theme: 'material',
      mode : this.handlerBuilder.mode,

      lineNumbers: true,

      // Addons
      matchBrackets            : true,
      autoCloseBrackets        : true,
      matchTags                : true,
      autoCloseTags            : true,
      foldGutter               : true,
      highlightSelectionMatches: true,
      styleActiveLine          : true,
      continueComments         : true,
      scrollbarStyle           : 'overlay'
    };
  }


  get handlerPreferences(): CodeEditorPreferences {
    return {
      /* Defaults */

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as CodeEditorPreferences;
  }
}
