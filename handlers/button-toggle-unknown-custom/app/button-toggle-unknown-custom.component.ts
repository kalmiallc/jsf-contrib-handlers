import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import {
  AbstractPropHandlerComponent,
  BreakpointOrCustomSize,
  JsfResponsiveService,
  ShowValidationMessagesDirective
}                                                                                                                   from '@kalmia/jsf-app';
import { BreakpointState }                                                                                          from '@angular/cdk/layout';
import { ButtonToggleUnknownCustomMessages }                                                                        from '../common/messages';
import {
  ButtonToggleUnknownCustomBuilder,
  ButtonToggleUnknownCustomOptions
}                                                                                                                   from '../common/button-toggle-unknown-custom.builder';
import {
  JsfPropBuilderObject,
  JsfPropInteger,
  JsfPropLayoutBuilder,
  PropStatus
}                                                                                                                   from '@kalmia/jsf-common-es2015';
import { Subscription }                                                                                             from 'rxjs';


interface ButtonToggleUnknownCustomPreferences {
  variant: 'basic';
  displayModeBreakpoint: BreakpointOrCustomSize;
  showSelectedCheckMark?: boolean;
  stepSize?: number;
}

@Component({
  selector       : 'app-button-toggle-unknown-custom',
  template       : `
    <div class="handler-common-button-toggle handler-common-button-toggle-unknown-custom jsf-animatable"
         [class.disabled]="disabled"
         [ngClass]="layoutSchema?.htmlClass || ''">
      <!-- Basic -->
      <div *ngIf="handlerPreferences.variant === 'basic'"
           class="button-toggle-wrapper basic button-toggle-items-2"
           [class.disabled]="disabled">
        <div class="items-container"
             [class.direction-row]="isDirectionRow"
             [class.direction-column]="!isDirectionRow">

          <!-- Item: Unknown -->
          <div class="item button-toggle-item-1 rounded __border-color--grey"
               [class.selected]="isUnknownSelected()"
               jsfHoverClass="hover"
               mat-ripple
               (click)="selectUnknown()">
            <div class="item-label no-text-selection">{{ i18n(messages.unknown) }}
              <div class="check-mark __background-color--primary __color--primary-contrast"
                   [class.visible]="handlerPreferences.showSelectedCheckMark && isUnknownSelected()">
                <mat-icon>check</mat-icon>
              </div>
            </div>
          </div>

          <!-- Item: Custom -->
          <div class="item no-vertical-padding button-toggle-item-2 rounded __border-color--grey"
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
                     class="mat-input-element mat-form-field-autofill-control"
                     [disabled]="disabled"
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
  styleUrls      : ['./button-toggle-unknown-custom.component.scss']
})
export class ButtonToggleUnknownCustomComponent
  extends AbstractPropHandlerComponent<JsfPropBuilderObject, ButtonToggleUnknownCustomBuilder> implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderObject>;

  private _subscriptions: Subscription[] = [];

  readonly messages = ButtonToggleUnknownCustomMessages;

  isDirectionRow = true;

  constructor(private responsiveService: JsfResponsiveService,
              protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective) {
    super(cdRef, showValidation);
  }

  get handlerPreferences(): ButtonToggleUnknownCustomPreferences {
    return {
      /* Defaults */
      variant              : 'basic',
      showSelectedCheckMark: true,
      displayModeBreakpoint: 'md',
      stepSize             : 1,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as ButtonToggleUnknownCustomPreferences;
  }

  get options(): ButtonToggleUnknownCustomOptions {
    return this.handlerBuilder.options;
  }

  get customValueErrors() {
    const statusTree = this.propBuilder.statusTree();
    if (statusTree.status === PropStatus.Valid) {
      return [];
    }

    return (statusTree.properties.value.errors || []).map(x => x.interpolatedMessage);
  }

  isUnknownSelected() {
    return this.enabled && this.value.unknown;
  }

  isCustomSelected() {
    return this.enabled && !this.value.unknown && this.value.value !== null;
  }

  selectUnknown() {
    if (this.disabled) {
      return;
    }

    this.propBuilder.patchValue({
      unknown: true,
      value  : 0
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
      unknown: false
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
    }).then(x => this.selectCustom())
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
      this._subscriptions.push(
        this.jsfBuilder.listenForValueChange(path)
          .subscribe(async x => {
            await this.handlerBuilder.validate();
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
