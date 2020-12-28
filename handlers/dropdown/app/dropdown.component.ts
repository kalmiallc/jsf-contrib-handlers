import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild
}                                     from '@angular/core';
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
}                                     from '@kalmia/jsf-common-es2015';
import {
  DropdownItem,
  HandlerDropdownBuilder
}                                     from '../common/dropdown.builder';
import {
  AbstractPropHandlerComponent,
  jsfDefaultScrollOptions,
  OverlayScrollbarsService,
  ShowValidationMessagesDirective
}                                     from '@kalmia/jsf-app';
import { takeUntil }                  from 'rxjs/operators';
import { DropdownMessages }           from '../common';
import * as OverlayScrollbars         from 'overlayscrollbars';
import { isEqual }                    from 'lodash';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

interface DropdownPreferences {
  stepperButtons?: boolean;
  searchable?: boolean;
}

@Component({
  selector       : 'app-dropdown',
  template       : `
      <div class="handler-common-dropdown jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''"
           [class.jsf-handler-dropdown-variant-standard]="isVariantStandard()"
           [class.jsf-handler-dropdown-variant-small]="isVariantSmall()">
          <div class="dropdown"
               [class.disabled]="disabled">
              <mat-form-field [color]="themePreferences.color"
                              [appearance]="themePreferences.appearance"
                              ngClass="jsf-form-field-select"
                              [class.jsf-mat-form-field-variant-standard]="isVariantStandard()"
                              [class.jsf-mat-form-field-variant-small]="isVariantSmall()"
                              jsfOutlineGapAutocorrect>
                  <mat-label *ngIf="propSchema?.title"
                             [attr.for]="id"
                             [style.display]="layoutSchema?.notitle ? 'none' : ''">
                      {{ i18n(propSchema?.title) }}
                  </mat-label>
                  <mat-select
                          [placeholder]="i18n(layoutSchema?.placeholder || '')"
                          [required]="propSchema.required"
                          [disabled]="disabled"
                          [multiple]="isArray"
                          [id]="id"
                          [name]="propBuilder.id"
                          [(ngModel)]="value"
                          #input="ngModel"
                          [jsfPropValidator]="layoutBuilder"
                          (selectionChange)="handleOnClick($event)"
                          [errorStateMatcher]="errorStateMatcher">
                      <mat-option *ngIf="handlerPreferences.searchable">
                          <ngx-mat-select-search ngModel
                                                 (ngModelChange)="search = $event"
                                                 [placeholderLabel]="i18n(messages.searchPlaceholder)"
                                                 [noEntriesFoundLabel]="i18n(messages.noResultsFound)">
                          </ngx-mat-select-search>
                      </mat-option>

                      <overlay-scrollbars [options]="scrollOptions">
                          <mat-option *ngIf="!required && !isArray" [value]="null">{{ i18n('--') }}</mat-option>
                          <mat-option *ngFor="let item of filteredItems; trackBy: trackByFn"
                                      [value]="item.value">
                              {{ i18n(item.label) }}
                          </mat-option>
                      </overlay-scrollbars>
                  </mat-select>

                  <mat-icon matPrefix *ngIf="handlerPreferences.stepperButtons"
                            ngClass="stepper-button decrement no-text-selection __color--{{ themePreferences.color }}">
                      {{ iconPrevious }}
                  </mat-icon>

                  <mat-icon matSuffix *ngIf="handlerPreferences.stepperButtons"
                            ngClass="stepper-button increment no-text-selection __color--{{ themePreferences.color }}">
                      {{ iconNext }}
                  </mat-icon>

                  <mat-hint *ngIf="propSchema?.description">{{ i18n(propSchema?.description) }}</mat-hint>

                  <mat-error *ngFor="let error of propBuilder.errors">
                      {{ error.interpolatedMessage }}
                  </mat-error>
              </mat-form-field>

              <div class="stepper-overlay decrement no-text-selection" *ngIf="handlerPreferences.stepperButtons"
                   (click)="previousItem()"></div>
              <div class="stepper-overlay increment no-text-selection" *ngIf="handlerPreferences.stepperButtons" (click)="nextItem()"></div>
          </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./dropdown.component.scss']
})
// tslint:disable-next-line:max-line-length
export class DropdownComponent extends AbstractPropHandlerComponent<JsfPropBuilderString | JsfPropBuilderNumber | JsfPropBuilderInteger | JsfPropBuilderId | JsfPropBuilderArray, HandlerDropdownBuilder> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
    // tslint:disable-next-line:max-line-length
    layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString | JsfPropBuilderNumber | JsfPropBuilderInteger | JsfPropBuilderId | JsfPropBuilderArray>;

  @ViewChild(OverlayScrollbarsComponent, { static: false })
  osComponent: OverlayScrollbarsComponent;

  private _search                         = void 0;
  private searchChange: EventEmitter<any> = new EventEmitter<any>();

  private _filteredItems: DropdownItem[] = [];

  public readonly scrollOptions: OverlayScrollbars.Options = {
    ...jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true
  };

  private cachedValue;

  public get search(): any {
    return this._search;
  }

  public set search(x: any) {
    this._search = x;
    this.searchChange.emit(x);
  }

  public messages = DropdownMessages;

  previousItem() {
    const idx  = this.selectedItemIndex;
    this.value = (idx !== undefined && idx > -1) ? this.items[Math.max(0, idx - 1)].value : this.items[0].value;
  }

  nextItem() {
    const idx  = this.selectedItemIndex;
    this.value = (idx !== undefined && idx > -1)
      ? this.items[Math.min(this.items.length - 1, idx + 1)].value
      : this.items[this.items.length - 1].value;
  }

  get selectedItem(): DropdownItem {
    if (this.value) {
      return this.items.find(x => x.value === this.value);
    }
  }

  get selectedItemIndex(): number {
    if (this.value) {
      return this.items.findIndex(x => x.value === this.value);
    }
  }

  get required(): boolean {
    return this.propSchema.required;
  }

  get disabled(): boolean {
    return this.propBuilder.disabled || this.providerPending || (!this.items || this.items.length === 0);
  }

  get providerPending(): boolean {
    return this.handlerBuilder.itemsProvider && this.handlerBuilder.itemsProvider.status === JsfProviderExecutorStatus.Pending;
  }

  get items(): DropdownItem[] {
    return this.handlerBuilder.items;
  }

  get filteredItems(): DropdownItem[] {
    return this._filteredItems;
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
              @Optional() protected showValidation: ShowValidationMessagesDirective,
              private osService: OverlayScrollbarsService) {
    super(cdRef, showValidation);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.updateFilteredItems();

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
        this.updateFilteredItems();
        this.cdRef.detectChanges();
      });

    if (this.handlerBuilder.itemsProvider) {
      this.handlerBuilder.itemsProvider.statusChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.updateFilteredItems();
          this.cdRef.detectChanges();
        });
    }

    this.searchChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateFilteredItems();
        this.cdRef.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.osService.registerOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.osService.deregisterOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  private updateFilteredItems() {
    this._filteredItems = this.search
      ? this.items.filter(x => x.label.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0)
      : this.items;
  }

  handleOnClick($event: any) {
    this.layoutBuilder.onClick($event)
      .catch(e => {
        throw e;
      });
  }

  trackByFn(index, item) {
    return item.value;
  }

  isVariantStandard = () => this.themePreferences.variant === 'standard';
  isVariantSmall    = () => this.themePreferences.variant === 'small';

}
