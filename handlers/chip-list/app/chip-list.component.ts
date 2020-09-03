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
      <div class="handler-common-chip-list jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''"
           [class.jsf-handler-chip-list-variant-standard]="isVariantStandard()"
           [class.jsf-handler-chip-list-variant-small]="isVariantSmall()">
          <div class="chip-list"
               [class.disabled]="disabled">
              <mat-form-field [color]="themePreferences.color"
                              [appearance]="themePreferences.appearance"
                              class="jsf-form-field-chip-list"
                              [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                              [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                              jsfOutlineGapAutocorrect>
                  <mat-chip-list #chipList>
                      <mat-chip *ngFor="let chip of chips; trackBy: trackByFn"
                                [selectable]="handlerPreferences.selectable"
                                color="primary"
                                [removable]="handlerPreferences.removable"
                                (removed)="remove(chip)">
                          {{ chip.value }}
                          <mat-icon matChipRemove *ngIf="handlerPreferences.removable">cancel</mat-icon>
                      </mat-chip>

                      <input [placeholder]="i18n(layoutSchema?.placeholder || '')"
                             [required]="propSchema?.required"
                             [disabled]="disabled"
                             [matChipInputFor]="chipList"
                             [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                             [matChipInputAddOnBlur]="handlerPreferences.addOnBlur"
                             (matChipInputTokenEnd)="add($event)">
                  </mat-chip-list>


                  <mat-hint *ngIf="propSchema?.description">{{ i18n(propSchema?.description) }}</mat-hint>

                  <mat-error *ngFor="let error of propBuilder.errors">
                      {{ error.interpolatedMessage }}
                  </mat-error>
              </mat-form-field>
          </div>
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

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  public messages = ChipListMessages;

  get required(): boolean {
    return this.propSchema.required;
  }

  get disabled(): boolean {
    return this.propBuilder.disabled;
  }

  get chips() {
    return (this.propBuilder.items || []).map(x => ({
      propBuilder: x as any,
      value      : x.getJsonValue()
    } as ChipValue));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.value = [...(this.value || []), value];
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.cdRef.detectChanges();
  }

  remove(chip: ChipValue): void {
    this.value = this.chips.filter(x => x.propBuilder.id !== chip.propBuilder.id).map(x => x.value);
    this.cdRef.detectChanges();
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

  trackByFn(index: number, item: ChipValue) {
    return item.propBuilder;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';
}
