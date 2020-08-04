import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import {
  AbstractPropHandlerComponent,
  BreakpointOrCustomSize,
  JsfResponsiveService,
  ShowValidationMessagesDirective
}                                                                                                                   from '@kalmia/jsf-app';
import { BreakpointState }                                                                                          from '@angular/cdk/layout';
import { ButtonToggleAllNoneCustomMessages }                                                                        from '../common/messages';
import {
  ButtonToggleAllNoneCustomBuilder,
  ButtonToggleAllNoneCustomOptions
}                                                                                                                   from '../common/button-toggle-all-none-custom.builder';
import {
  JsfPropBuilderObject,
  JsfPropInteger,
  JsfPropLayoutBuilder,
  PropStatus
}                                                                                                                   from '@kalmia/jsf-common-es2015';
import { Subscription }                                                                                             from 'rxjs';


interface ButtonToggleAllNoneCustomPreferences {
  variant: 'basic';
  displayModeBreakpoint: BreakpointOrCustomSize;
  showSelectedCheckMark?: boolean;
  stepSize?: number;
}

@Component({
  selector       : 'app-button-toggle-all-none-custom',
  template       : `
    <div class="handler-common-button-toggle handler-common-button-toggle-all-none-custom jsf-animatable"
         [class.disabled]="disabled"
         [ngClass]="layoutSchema?.htmlClass || ''">
      <!-- Basic -->
      <div *ngIf="handlerPreferences.variant === 'basic'"
           class="button-toggle-wrapper basic button-toggle-items-3"
           [class.disabled]="disabled">
        <div class="items-container"
             [class.direction-row]="isDirectionRow"
             [class.direction-column]="!isDirectionRow">
          <!-- Item: All -->
          <div class="item button-toggle-item-1 rounded __border-color--grey"
               [class.selected]="isAllSelected()"
               jsfHoverClass="hover"
               mat-ripple
               (click)="selectAll()">
            <div class="item-label no-text-selection">{{ i18n(messages.all) }}
              <div class="check-mark __background-color--primary __color--primary-contrast"
                   [class.visible]="handlerPreferences.showSelectedCheckMark && isAllSelected()">
                <mat-icon>check</mat-icon>
              </div>
            </div>
          </div>

          <!-- Item: None -->
          <div *ngIf="hasNoneItem" class="item button-toggle-item-2 rounded __border-color--grey"
               [class.selected]="isNoneSelected()"
               jsfHoverClass="hover"
               mat-ripple
               (click)="selectNone()">
            <div class="item-label no-text-selection">{{ i18n(messages.none) }}
              <div class="check-mark __background-color--primary __color--primary-contrast"
                   [class.visible]="handlerPreferences.showSelectedCheckMark && isNoneSelected()">
                <mat-icon>check</mat-icon>
              </div>
            </div>
          </div>

          <!-- Item: Custom -->
          <div class="item no-vertical-padding button-toggle-item-3 rounded __border-color--grey"
               [class.invalid]="customValueErrors.length"
               [class.selected]="isCustomSelected()"
               jsfHoverClass="hover"
               mat-ripple>
            <div class="custom-value-container">
              <div class="stepper-button decrement"
                   (click)="decrement()">
                <mat-icon class="__color--primary no-text-selection">remove</mat-icon>
              </div>

              <input type="number"
                     [disabled]="disabled"
                     class="mat-input-element mat-form-field-autofill-control"
                     [(ngModel)]="customValue"
                     jsfNumberInputAutoCorrect>

              <div class="stepper-button increment"
                   (click)="increment()">
                <mat-icon class="__color--primary no-text-selection">add</mat-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation errors -->
      <jsf-error-messages *ngIf="customValueErrors.length" [messages]="customValueErrors"></jsf-error-messages>
      <jsf-error-messages *ngIf="invalid" [messages]="interpolatedErrors"></jsf-error-messages>
    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./button-toggle-all-none-custom.component.scss']
})
export class ButtonToggleAllNoneCustomComponent
  extends AbstractPropHandlerComponent<JsfPropBuilderObject, ButtonToggleAllNoneCustomBuilder> implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderObject>;

  private _subscriptions: Subscription[] = [];

  readonly messages = ButtonToggleAllNoneCustomMessages;

  isDirectionRow = true;

  constructor(private responsiveService: JsfResponsiveService,
              protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  get handlerPreferences(): ButtonToggleAllNoneCustomPreferences {
    return {
      /* Defaults */
      variant              : 'basic',
      showSelectedCheckMark: true,
      displayModeBreakpoint: 'md',
      stepSize             : 1,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as ButtonToggleAllNoneCustomPreferences;
  }

  get options(): ButtonToggleAllNoneCustomOptions {
    return this.handlerBuilder.options;
  }

  get customValueErrors() {
    const statusTree = this.propBuilder.statusTree();
    if (statusTree.status === PropStatus.Valid) {
      return [];
    }

    return (statusTree.properties.value.errors || []).map(x => x.interpolatedMessage);
  }

  get hasNoneItem() {
    try {
      return !!this.propBuilder.getControlByPath('none');
    } catch (e) {}
    return false;
  }

  isAllSelected() {
    return this.enabled && this.value.all;
  }

  isNoneSelected() {
    return this.enabled && this.value.none;
  }

  isCustomSelected() {
    return this.enabled && !this.value.none && !this.value.all && this.value.value !== null;
  }

  selectAll() {
    if (this.disabled) {
      return;
    }

    this.propBuilder.patchValue({
      all  : true,
      none : false,
      value: this.dependsOnValue
    }).catch(e => {
      throw e;
    });

    this.touched = true;
    this.dirty   = true;
  }

  selectNone() {
    if (this.disabled) {
      return;
    }

    this.propBuilder.patchValue({
      all  : false,
      none : true,
      value: 0
    }).catch(e => {
      throw e;
    });

    this.touched = true;
    this.dirty   = true;
  }

  selectCustom() {
    if (this.disabled) {
      return;
    }

    this.propBuilder.patchValue({
      all : false,
      none: false
    }).catch(e => {
      throw e;
    });

    this.touched = true;
    this.dirty   = true;
  }

  increment() {
    if (this.disabled) {
      return;
    }

    let x = (this.customValue || 0) + this.handlerPreferences.stepSize;
    let maximum;
    if (this.dependsOnValue !== null) {
      maximum = this.dependsOnValue;
    }
    if ((this.customValueControl.prop as JsfPropInteger).maximum !== undefined) {
      maximum = (this.customValueControl.prop as JsfPropInteger).maximum;
    }

    if (maximum !== undefined) {
      x = Math.min(x, maximum);
    }
    this.customValue = x;
  }

  decrement() {
    if (this.disabled) {
      return;
    }

    let x = (this.customValue || 0) - this.handlerPreferences.stepSize;
    let minimum;
    if (this.dependsOnControlMinimum !== undefined) {
      minimum = this.dependsOnControlMinimum;
    }
    if ((this.customValueControl.prop as JsfPropInteger).minimum !== undefined) {
      minimum = (this.customValueControl.prop as JsfPropInteger).minimum;
    }

    if (minimum !== undefined) {
      x = Math.max(x, minimum);
    }
    this.customValue = x;
  }

  get customValueControl() {
    return this.propBuilder.getControlByPath('value');
  }

  get dependsOnValue() {
    if (Array.isArray(this.options.dependsOn)) {
      let val = null;
      for (const dependsOnPath of this.options.dependsOn) {
        const x = this.rootPropBuilder.getControlByPath(dependsOnPath).getValue();
        val     = val === null || x < val ? (x !== null ? x : val) : val;
      }
      return val;
    } else {
      return this.rootPropBuilder.getControlByPath(this.options.dependsOn).getValue();
    }
  }

  get dependsOnControlMinimum() {
    if (Array.isArray(this.options.dependsOn)) {
      let min = null;
      for (const dependsOnPath of this.options.dependsOn) {
        const x = (this.rootPropBuilder.getControlByPath(dependsOnPath).prop as JsfPropInteger).minimum;
        min     = min === null || x > min ? (x !== null ? x : min) : min;
      }
      return min;
    } else {
      return (this.rootPropBuilder.getControlByPath(this.options.dependsOn).prop as JsfPropInteger).minimum;
    }
  }

  set customValue(value: number) {
    if (this.disabled) {
      return;
    }

    if (this.propBuilder.getControlByPath('value').getValue() !== value) {
      this.touched = true;
      this.dirty   = true;
    }

    this.propBuilder.patchValue({
      value
    })
      .then(() => this.selectCustom())
      .catch(e => {
        throw e;
      });
  }

  get customValue(): number {
    return this.customValueControl.getValue();
  }

  ngOnInit() {
    super.ngOnInit();

    // Responsive breakpoint logic
    this.responsiveService.matchMediaBreakpointUp(this.handlerPreferences.displayModeBreakpoint)
      .subscribe((state: BreakpointState) => {
        this.isDirectionRow = state.matches;
        this.cdRef.detectChanges();
      });

    // Custom value change logic
    const paths = Array.isArray(this.options.dependsOn) ? this.options.dependsOn : [this.options.dependsOn];

    for (const path of paths) {
      const dependencyAbsolutePath = this.handlerBuilder.builder.convertAbstractSiblingPathToPath(path);
      this._subscriptions.push(
        this.jsfBuilder.listenForStatusChange(dependencyAbsolutePath)
          .subscribe(async x => {
            if (this.isAllSelected() && x.status !== PropStatus.Pending && this.customValueControl.getValue() !== this.dependsOnValue) {
              // Don't use the setter, we want to bypass the selectCustom call.
              await this.propBuilder.patchValue({
                value: this.dependsOnValue
              });
              this.dirty = true;
            }
          })
      );
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._subscriptions.map(x => x.unsubscribe());
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
