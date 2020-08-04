import { NgModule }                                                                  from '@angular/core';
import { CommonModule }                                                              from '@angular/common';
import { ButtonToggleUnknownCustomComponent }                                        from './button-toggle-unknown-custom.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule }                                                               from '@angular/forms';
import { ButtonToggleUnknownCustomBuilder }                                          from '../common/button-toggle-unknown-custom.builder';
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
  declarations   : [ButtonToggleUnknownCustomComponent],
  exports        : [ButtonToggleUnknownCustomComponent]
})
export class ButtonToggleUnknownCustomModule {

  public static readonly entryComponent = ButtonToggleUnknownCustomComponent;
  public static readonly builder        = ButtonToggleUnknownCustomBuilder;

}
