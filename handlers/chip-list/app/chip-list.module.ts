import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ChipListComponent }      from './chip-list.component';
import { HandlerChipListBuilder } from '../common/chip-list.builder';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { FormsModule }            from '@angular/forms';
import { JsfComponentsModule }    from '@kalmia/jsf-app';
import { MatChipsModule }         from '@angular/material/chips';
import { MatIconModule }          from '@angular/material/icon';

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,
    JsfComponentsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule
  ],
  declarations: [ChipListComponent],
  exports     : [ChipListComponent]
})
export class ChipListModule {

  public static readonly entryComponent = ChipListComponent;
  public static readonly builder        = HandlerChipListBuilder;

}
