import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  JsfLayoutPropPreferences,
  JsfLayoutPropStringPreferences,
  JsfPropBuilderArray,
  JsfPropBuilderString,
  JsfPropLayoutBuilder
}                                                                       from '@kalmia/jsf-common-es2015';
import { HandlerChipListBuilder }                                       from '../common/chip-list.builder';
import { AbstractPropHandlerComponent }                                 from '@kalmia/jsf-app';
import { ChipListMessages }                                             from '../common';
import { MatChipInputEvent }                                            from '@angular/material/chips';
import {
  COMMA,
  ENTER,
  SPACE
}                                                                       from '@angular/cdk/keycodes';

export interface ChipValue {
  value: any;
  propBuilder: JsfPropBuilderString;
}

export interface ChipListPreferences {
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
}

@Component({
  selector       : 'app-chip-list',
  template       : `
      <div class="handler-common-chip-list jsf-animatable">
        <jsf-chip-list [htmlClass]="layoutSchema?.htmlClass || ''"
                       [disabled]="disabled"
                       [color]="themePreferences.color"
                       [appearance]="themePreferences.appearance"
                       [variant]="themePreferences.variant"
                       [selectable]="handlerPreferences.selectable"
                       [removable]="handlerPreferences.removable"
                       [placeholder]="i18n(layoutSchema?.placeholder || '')"
                       [required]="propSchema?.required"
                       [addOnBlur]="handlerPreferences.addOnBlur"
                       [description]="i18n(propSchema?.description)"
                       [layoutBuilder]="layoutBuilder"
                       [(ngModel)]="value">
        </jsf-chip-list>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./chip-list.component.scss']
})
// tslint:disable-next-line:max-line-length
export class ChipListComponent extends AbstractPropHandlerComponent<JsfPropBuilderArray, HandlerChipListBuilder> implements OnInit, OnDestroy {

  @Input()
    // tslint:disable-next-line:max-line-length
    layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderArray>;

  public messages = ChipListMessages;

  get required(): boolean {
    return this.propSchema.required;
  }

  get disabled(): boolean {
    return this.propBuilder.disabled;
  }

  get themePreferences(): JsfLayoutPropStringPreferences {
    return {
      /* Defaults */
      appearance : 'legacy',
      color      : 'primary',
      variant    : 'standard',
      clearable  : false,
      prefixIcon : '',
      prefixLabel: '',
      suffixIcon : '',
      suffixLabel: '',

      /* Global overrides */
      ...(this.preferences ? this.preferences.string : {}),

      /* Layout overrides */
      ...(this.propPreferences || {})
    } as JsfLayoutPropStringPreferences;
  }

  get handlerPreferences(): ChipListPreferences {
    return {
      /* Defaults */
      addOnBlur : true,
      removable : true,
      selectable: true,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as ChipListPreferences;
  }

  get preferences() {
    return this.jsfBuilder.layoutBuilder.preferences;
  }

  get propPreferences() {
    return this.layoutSchema.preferences as JsfLayoutPropPreferences;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
