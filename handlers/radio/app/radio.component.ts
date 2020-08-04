import { ChangeDetectionStrategy, Component, Input }  from '@angular/core';
import { JsfPropBuilderString, JsfPropLayoutBuilder } from '@kalmia/jsf-common-es2015';
import { HandlerRadioBuilder, RadioItem }             from '../common/radio.builder';
import { AbstractPropHandlerComponent }               from '@kalmia/jsf-app';


interface RadioPreferences {
  layout: 'block' | 'inline' | 'flex';
}

@Component({
  selector       : 'app-radio',
  template       : `
      <div class="handler-common-radio jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''"
           [class.jsf-handler-radio-layout-block]="isLayoutBlock()"
           [class.jsf-handler-radio-layout-inline]="isLayoutInline()"
           [class.jsf-handler-radio-layout-flex]="isLayoutFlex()">
          <mat-radio-group [(ngModel)]="value"
                           #input="ngModel"
                           [jsfPropValidator]="layoutBuilder"
                           [disabled]="propBuilder.disabled"
                           [required]="propSchema.required">
              <mat-radio-button *ngFor="let item of items; trackBy: trackByFn"
                                [value]="item.value"
                                [matTooltip]="item.tooltip"
                                [matTooltipDisabled]="!item.tooltip">
                  {{ i18n(item.label) }}
              </mat-radio-button>
          </mat-radio-group>

          <!-- Validation errors -->
          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class RadioComponent extends AbstractPropHandlerComponent<JsfPropBuilderString, HandlerRadioBuilder> {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

  get items(): RadioItem[] {
    return this.handlerBuilder.items;
  }

  trackByFn(index, item) {
    return item.value;
  }

  get handlerPreferences(): RadioPreferences {
    return {
      /* Defaults */
      layout: 'block',

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as RadioPreferences;
  }

  isLayoutBlock  = () => this.handlerPreferences.layout === 'block';
  isLayoutInline = () => this.handlerPreferences.layout === 'inline';
  isLayoutFlex   = () => this.handlerPreferences.layout === 'flex';

}
