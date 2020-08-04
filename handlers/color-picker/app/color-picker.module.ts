import { NgModule }                                                                             from '@angular/core';
import { CommonModule }                                                                         from '@angular/common';
import { ColorPickerComponent }                                                                 from './color-picker.component';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsfComponentsModule }                                                                  from '@kalmia/jsf-app';
import { ColorPickerBuilder }                                                                   from '../common/color-picker.builder';
import { FormsModule }                                                                          from '@angular/forms';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule
  ],
  declarations   : [ColorPickerComponent],
  exports        : [ColorPickerComponent]
})
export class ColorPickerModule {

  public static readonly entryComponent = ColorPickerComponent;
  public static readonly builder        = ColorPickerBuilder;

}
