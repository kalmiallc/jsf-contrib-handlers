import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional } from '@angular/core';
import {
  JsfPropBuilderArray,
  JsfPropBuilderInteger,
  JsfPropBuilderNumber,
  JsfPropBuilderString,
  JsfPropLayoutBuilder
}                                                                                                        from '@kalmia/jsf-common-es2015';
import {
  ButtonToggleBuilder,
  ButtonToggleItem
}                                                                                                        from '../common/button-toggle.builder';
import {
  AbstractPropHandlerComponent,
  BreakpointOrCustomSize,
  JsfResponsiveService,
  ShowValidationMessagesDirective
}                                                                                                        from '@kalmia/jsf-app';
import { BreakpointState }                                                                               from '@angular/cdk/layout';
import { takeUntil }                                                                                     from 'rxjs/operators';
import { isEqual } from 'lodash';

interface ButtonTogglePreferences {
  variant: 'basic' | 'tile' | 'tile-large';
  displayModeBreakpoint: BreakpointOrCustomSize;
  showSelectedCheckMark?: boolean;
  scaleModeTilesPerRow?: number;
}

@Component({
  selector       : 'app-button-toggle',
  template       : `
      <div class="handler-common-button-toggle jsf-animatable"
           [class.disabled]="disabled"
           [ngClass]="layoutSchema?.htmlClass || ''">
          <!-- Basic -->
          <div *ngIf="handlerPreferences.variant === 'basic'"
               class="button-toggle-wrapper basic button-toggle-items-{{ items.length }}"
               [class.disabled]="disabled">
              <div class="items-container"
                   [class.direction-row]="isDirectionRow"
                   [class.direction-column]="!isDirectionRow">
                  <div *ngFor="let item of items; index as i; trackBy: trackByFn"
                       class="item button-toggle-item-{{ i }} rounded __border-color--grey"
                       [class.selected]="isItemSelected(item)"
                       [class.disabled]="!isItemEnabled(item)"
                       jsfHoverClass="hover"
                       mat-ripple
                       (click)="setSelectedItem(item, $event)">
                      <div class="item-label no-text-selection">{{ i18n(item.label) }}
                          <div class="check-mark __background-color--primary __color--primary-contrast"
                               [class.visible]="handlerPreferences.showSelectedCheckMark && isItemSelected(item)">
                              <mat-icon>check</mat-icon>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Tiles -->
          <div *ngIf="handlerPreferences.variant === 'tile'"
               class="button-toggle-wrapper tile button-toggle-items-{{ items.length }}">
              <div class="items-container">
                  <!-- Preset options -->
                  <div *ngFor="let item of items; index as i; trackBy: trackByFn"
                       class="button-toggle-tile button-toggle-item-{{ i }}"
                       [class.selected]="isItemSelected(item)"
                       jsfHoverClass="hover"
                       (click)="setSelectedItem(item, $event)"
                       [ngStyle]="{ 'width.%': scaleModeTileWidthPercentage }">

                      <div class="inner-tile-container">
                          <div class="icon-container rounded">
                              <div class="icon rounded"
                                   [ngStyle]="{ 'background': getItemIconBackgroundStyle(item), 'background-size': 'cover' }"
                                   matRipple>
                              </div>
                              <div class="selection-border rounded __border-color--primary"></div>
                              <div class="check-mark __background-color--primary __color--primary-contrast"
                                   [class.visible]="handlerPreferences.showSelectedCheckMark && isItemSelected(item)">
                                  <mat-icon>check</mat-icon>
                              </div>
                          </div>

                          <div class="label-container no-text-selection">
                              <span>{{ i18n(item.label) }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Big tiles -->
          <div *ngIf="handlerPreferences.variant === 'tile-large'"
               class="button-toggle-wrapper tile-large button-toggle-items-{{ items.length }}">
              <div class="items-container">
                  <!-- Preset options -->
                  <div *ngFor="let item of items; index as i; trackBy: trackByFn"
                       class="button-toggle-tile-large button-toggle-item-{{ i }}"
                       [class.selected]="isItemSelected(item)"
                       jsfHoverClass="hover"
                       (click)="setSelectedItem(item, $event)"
                       [ngStyle]="{ 'width.%': scaleModeTileWidthPercentage }">
          
                      <div class="inner-tile-large-container">
                          <div class="icon-container rounded">
                              <div class="icon rounded"
                                   [ngStyle]="{ 'background': getItemIconBackgroundStyle(item), 'background-size': 'cover' }"
                                   matRipple>
                              </div>
                              <div class="selection-border rounded __border-color--primary"></div>
                              <div class="check-mark __background-color--primary __color--primary-contrast"
                                   [class.visible]="handlerPreferences.showSelectedCheckMark && isItemSelected(item)">
                                  <mat-icon>check</mat-icon>
                              </div>
                          </div>

                          <div class="label-container no-text-selection">
                              <span>{{ i18n(item.label) }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Validation errors -->
          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./button-toggle.component.scss']
})
export class ButtonToggleComponent extends AbstractPropHandlerComponent<JsfPropBuilderString |
                                                                        JsfPropBuilderInteger |
                                                                        JsfPropBuilderNumber |
                                                                        JsfPropBuilderArray, ButtonToggleBuilder>
  implements OnInit, AfterViewInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

  isDirectionRow      = true;
  isTileFixedSizeMode = true;

  constructor(private responsiveService: JsfResponsiveService,
              protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  get handlerPreferences(): ButtonTogglePreferences {
    return {
      /* Defaults */
      variant              : 'basic',
      showSelectedCheckMark: true,
      displayModeBreakpoint: 'md',
      scaleModeTilesPerRow : 1,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as ButtonTogglePreferences;
  }

  get items(): ButtonToggleItem[] {
    return this.handlerBuilder.items;
  }

  get unselectable(): boolean {
    return this.propSchema.required !== true;
  }

  get scaleModeTileWidthPercentage() {
    return !this.isTileFixedSizeMode ? (1 / this.handlerPreferences.scaleModeTilesPerRow) * 100 : null;
  }

  ngOnInit() {
    super.ngOnInit();

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

    // Responsive breakpoint logic
    this.responsiveService.matchMediaBreakpointUp(this.handlerPreferences.displayModeBreakpoint)
      .subscribe((state: BreakpointState) => {
        this.isDirectionRow      = state.matches;
        this.isTileFixedSizeMode = state.matches;
        this.cdRef.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  getItemIconBackgroundStyle(item: ButtonToggleItem): string {
    return `url(${ item.icon }) no-repeat center center`;
  }

  isItemEnabled(item: ButtonToggleItem) {
    // tslint:disable
    if (item.enabledIf && item.enabledIf.$eval) {
      return !!this.jsfBuilder.runEval(item.enabledIf.$eval);
    }
    return true;
  }

  isItemSelected(item: ButtonToggleItem) {
    switch (this.propSchema.type) {
      case 'array':
        return (this.value || []).indexOf(item.value) > -1;
      default:
        return (this.value !== null && this.value === item.value) || (item.value === null && this.value === item.value);
    }
  }

  setSelectedItem(item: ButtonToggleItem, $event: any) {
    if (!this.isItemEnabled(item)) {
      return;
    }

    if (this.disabled) {
      return;
    }

    switch (this.propSchema.type) {
      case 'array':
        // Remove item if selected, add otherwise
        if (this.isItemSelected(item)) {
          this.value = (this.value as any[]).filter(x => x !== item.value);
        } else {
          this.value = [...(this.value as any[] || []), item.value];
        }
        break;
      default:
        // In case where current value matches new value and the prop is unselectable, set the value to null.
        if (isEqual(this.value, item.value) && this.unselectable) {
          this.value = null;
        } else {
          this.value = item.value;
        }
        break;
    }

    this.layoutBuilder.onClick($event)
      .catch(e => {
        console.error(e);
        throw e;
      });
  }

  trackByFn(index, item) {
    return item.value;
  }
}
