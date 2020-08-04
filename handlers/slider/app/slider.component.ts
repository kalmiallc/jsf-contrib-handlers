import { ChangeDetectionStrategy, Component, Input }                         from '@angular/core';
import { JsfPropBuilderInteger, JsfPropBuilderNumber, JsfPropLayoutBuilder } from '@kalmia/jsf-common-es2015';
import { HandlerSliderBuilder }                                              from '../common/slider.builder';
import { AbstractPropHandlerComponent }                                      from '@kalmia/jsf-app';


interface SliderPreferences {
  orientation: 'horizontal' | 'vertical';
  thumbLabel: boolean;
  tickInterval: boolean | 'auto' | number;
  invert: boolean;
}

@Component({
  selector       : 'app-slider',
  template       : `
      <div class="handler-common-slider jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''">

          <!-- Slider -->
          <mat-slider [disabled]="disabled"
                      [invert]="invert"
                      [max]="max"
                      [min]="min"
                      [step]="step"
                      [thumbLabel]="thumbLabel"
                      [tickInterval]="tickInterval"
                      [(ngModel)]="value"
                      [vertical]="vertical">
          </mat-slider>

          <!-- Validation errors -->
          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : []
})
export class SliderComponent extends AbstractPropHandlerComponent<JsfPropBuilderNumber | JsfPropBuilderInteger, HandlerSliderBuilder> {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderNumber | JsfPropBuilderInteger>;

  get invert(): boolean {
    return this.handlerPreferences.invert;
  }

  get min(): number {
    return this.handlerBuilder.min;
  }

  get max(): number {
    return this.handlerBuilder.max;
  }

  get step(): number {
    return this.handlerBuilder.step;
  }

  get thumbLabel(): boolean {
    return this.handlerPreferences.thumbLabel;
  }

  get tickInterval(): boolean | 'auto' | number {
    return this.handlerPreferences.tickInterval === true ? 'auto' : this.handlerPreferences.tickInterval;
  }

  get vertical(): boolean {
    return this.handlerPreferences.orientation === 'vertical';
  }

  get handlerPreferences(): SliderPreferences {
    return {
      /* Defaults */
      orientation : 'horizontal',
      thumbLabel  : true,
      tickInterval: false,
      invert      : false,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as SliderPreferences;
  }
}
