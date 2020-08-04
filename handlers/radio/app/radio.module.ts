import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RadioComponent }      from './radio.component';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatRadioModule }      from '@angular/material/radio';
import { HandlerRadioBuilder } from '../common/radio.builder';
import { FormsModule }         from '@angular/forms';
import { JsfComponentsModule } from '@kalmia/jsf-app';
import { MatTooltipModule }    from '@kalmia/material/tooltip';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatTooltipModule
  ],
  declarations   : [RadioComponent],
  exports        : [RadioComponent]
})
export class RadioModule {

  public static readonly entryComponent = RadioComponent;
  public static readonly builder        = HandlerRadioBuilder;

}
