import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import {
  JsfLayoutPropPreferences,
  JsfLayoutPropStringPreferences,
  JsfPropBuilderArray,
  JsfPropBuilderId,
  JsfPropBuilderInteger,
  JsfPropBuilderNumber,
  JsfPropBuilderString,
  JsfPropLayoutBuilder,
  JsfProviderExecutorStatus
}                                                                                                                   from '@kalmia/jsf-common-es2015';
import {
  DropdownItem,
  HandlerDropdownBuilder
}                                                                                                                   from '../common/dropdown.builder';
import { AbstractPropHandlerComponent, ShowValidationMessagesDirective }                                            from '@kalmia/jsf-app';
import { takeUntil }                                                                                                from 'rxjs/operators';
import { DropdownMessages }                                                                                         from '../common';
import { isEqual }                                                                                                  from 'lodash';

interface DropdownPreferences {
  stepperButtons?: boolean;
  searchable?: boolean;
  sortSelectedToTop?: boolean;
}

@Component({
  selector       : 'app-dropdown',
  template       : `
      <jsf-dropdown [htmlClass]="layoutSchema?.htmlClass"
                    [variant]="themePreferences.variant"
                    [color]="themePreferences.color"
                    [appearance]="themePreferences.appearance"
                    [title]="i18n(propSchema?.title)"
                    [notitle]="layoutSchema?.notitle"
                    [placeholder]="i18n(layoutSchema?.placeholder || '')"
                    [required]="propSchema.required"
                    [disabled]="disabled"
                    [multiple]="isArray"
                    [id]="id"
                    [name]="propBuilder.id"
                    [(ngModel)]="value"
                    [layoutBuilder]="layoutBuilder"
                    (onClick)="handleOnClick($event)"
                    [errorStateMatcher]="errorStateMatcher"
                    [searchable]="handlerPreferences.searchable"
                    [searchPlaceholderLabel]="i18n(messages.searchPlaceholder)"
                    [searchNoEntriesFoundLabel]="i18n(messages.noResultsFound)"
                    [stepperButtons]="handlerPreferences.stepperButtons"
                    [iconPrevious]="iconPrevious"
                    [iconNext]="iconNext"
                    [items]="items"
                    [description]="i18n(propSchema?.description)"
                    [sortSelectedToTop]="handlerPreferences.sortSelectedToTop">
      </jsf-dropdown>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./dropdown.component.scss']
})
// tslint:disable-next-line:max-line-length
export class DropdownComponent extends AbstractPropHandlerComponent<JsfPropBuilderString | JsfPropBuilderNumber | JsfPropBuilderInteger | JsfPropBuilderId | JsfPropBuilderArray, HandlerDropdownBuilder> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
    // tslint:disable-next-line:max-line-length
    layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString | JsfPropBuilderNumber | JsfPropBuilderInteger | JsfPropBuilderId | JsfPropBuilderArray>;

  private cachedValue;

  public messages = DropdownMessages;

  get required(): boolean {
    return this.propSchema.required;
  }

  get disabled(): boolean {
    return this.propBuilder.disabled || this.providerPending;
  }

  get providerPending(): boolean {
    return this.handlerBuilder.itemsProvider && this.handlerBuilder.itemsProvider.status === JsfProviderExecutorStatus.Pending;
  }

  get items(): DropdownItem[] {
    return this.handlerBuilder.items;
  }

  get isArray(): boolean {
    return this.handlerBuilder.isArray;
  }

  /**
   * Get prop value.
   */
  get value() {
    return this.cachedValue;
  }

  /**
   * Set prop value.
   * @param x value
   */
  set value(x: any) {
    if (!isEqual(x, this.propBuilder.getJsonValue())) {
      this.propBuilder.setJsonValue(x as never)
        .then(() => {
          this.propBuilder.onUserValueChange();
        })
        .catch(e => {
          console.error(e);
          throw e;
        });
      this.touched = true;
      this.dirty   = true;
    }
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

  get handlerPreferences(): DropdownPreferences {
    return {
      /* Defaults */
      stepperButtons: false,
      searchable    : false,
      sortSelectedToTop: false,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as DropdownPreferences;
  }

  get preferences() {
    return this.jsfBuilder.layoutBuilder.preferences;
  }

  get propPreferences() {
    return this.layoutSchema.preferences as JsfLayoutPropPreferences;
  }

  get iconNext() {
    return [
      'number',
      'integer'
    ].indexOf((this.propBuilder.prop as any).type) > -1 ? 'add' : 'keyboard_arrow_right';
  }

  get iconPrevious() {
    return [
      'number',
      'integer'
    ].indexOf((this.propBuilder.prop as any).type) > -1 ? 'remove' : 'keyboard_arrow_left';
  }

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.handlerBuilder.builder.statusChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cachedValue = this.handlerBuilder.getJsonValue();
        this.cdRef.detectChanges();
      });

    this.handlerBuilder.update$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cachedValue = this.handlerBuilder.getJsonValue();
        this.cdRef.detectChanges();
      });

    this.cachedValue = this.handlerBuilder.getJsonValue();


    this.handlerBuilder.itemsChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cdRef.detectChanges();
      });

    if (this.handlerBuilder.itemsProvider) {
      this.handlerBuilder.itemsProvider.statusChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.cdRef.detectChanges();
        });
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  handleOnClick($event: any) {
    this.layoutBuilder.onClick($event)
      .catch(e => {
        throw e;
      });
  }

}
