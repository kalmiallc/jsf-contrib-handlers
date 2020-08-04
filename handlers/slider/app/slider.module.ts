import { NgModule }                            from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { SliderComponent }                     from './slider.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { HandlerSliderBuilder }                from '../common/slider.builder';
import { FormsModule }                         from '@angular/forms';
import { JsfComponentsModule }                 from '@kalmia/jsf-app';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatFormFieldModule,
    MatSliderModule
  ],
  declarations   : [SliderComponent],
  exports        : [SliderComponent]
})
export class SliderModule {

  public static readonly entryComponent = SliderComponent;
  public static readonly builder        = HandlerSliderBuilder;

}
