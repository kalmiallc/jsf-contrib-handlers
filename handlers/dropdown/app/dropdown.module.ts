import { NgModule }                                           from '@angular/core';
import { CommonModule }                                       from '@angular/common';
import { DropdownComponent }                                  from './dropdown.component';
import { HandlerDropdownBuilder }                             from '../common/dropdown.builder';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule }                                        from '@angular/forms';
import { JsfComponentsModule }                                from '@kalmia/jsf-app';
import { NgxMatSelectSearchModule }                           from 'ngx-mat-select-search';

@NgModule({
  imports        : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMatSelectSearchModule
  ],
  declarations   : [DropdownComponent],
  exports        : [DropdownComponent]
})
export class DropdownModule {

  public static readonly entryComponent = DropdownComponent;
  public static readonly builder        = HandlerDropdownBuilder;

}
