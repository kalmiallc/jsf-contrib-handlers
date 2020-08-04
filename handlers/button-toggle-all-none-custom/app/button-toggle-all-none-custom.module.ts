import { NgModule }                                                                  from '@angular/core';
import { CommonModule }                                                              from '@angular/common';
import { ButtonToggleAllNoneCustomComponent }                                        from './button-toggle-all-none-custom.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule }                                                               from '@angular/forms';
import { ButtonToggleAllNoneCustomBuilder }                                          from '../common/button-toggle-all-none-custom.builder';
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
  declarations   : [ButtonToggleAllNoneCustomComponent],
  exports        : [ButtonToggleAllNoneCustomComponent]
})
export class ButtonToggleAllNoneCustomModule {

  public static readonly entryComponent = ButtonToggleAllNoneCustomComponent;
  public static readonly builder        = ButtonToggleAllNoneCustomBuilder;

}
