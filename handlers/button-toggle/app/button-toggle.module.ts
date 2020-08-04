import { NgModule }                                                                  from '@angular/core';
import { CommonModule }                                                              from '@angular/common';
import { ButtonToggleComponent }                                                     from './button-toggle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule }                                                               from '@angular/forms';
import { ButtonToggleBuilder }                                                       from '../common/button-toggle.builder';
import { JsfComponentsModule }                                                       from '@kalmia/jsf-app';
import { LayoutModule }                                                              from '@angular/cdk/layout';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatRippleModule,
    LayoutModule
  ],
  declarations   : [ButtonToggleComponent],
  exports        : [ButtonToggleComponent]
})
export class ButtonToggleModule {

  public static readonly entryComponent = ButtonToggleComponent;
  public static readonly builder        = ButtonToggleBuilder;

}
