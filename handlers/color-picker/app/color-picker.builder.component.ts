import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SkipSelf } from '@angular/core';
import { JsfLayoutEditor }                                                        from '@kalmia/jsf-common-es2015';
import { AbstractPropHandlerLayoutBuilderComponent }                              from '@kalmia/jsf-app';


@Component({
  selector       : 'app-color-picker-builder',
  template       : `
      <div class="handler-common-color-picker-builder" [ngClass]="getLayoutEditorClass()">
           <div class="min-h-12 d-flex justify-content-center align-items-center flex-column __color--black-30">
              <span class="d-block font-weight-bold text-truncate">
                  {{ prop.handlerType }}
              </span>
             <div class="background-color-picker"></div>
           </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `
          .background-color-picker {
              width: 40px;
              height: 40px;
              border-radius: 160px;
              background:      linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
              background-size: 1800% 1800%;
              animation:       rainbow 18s ease infinite;
          }

          @keyframes rainbow {
              0% {background-position: 0% 82%}
              50% {background-position: 100% 19%}
              100% {background-position: 0% 82%}
          }
    `
  ]
})
export class ColorPickerBuilderComponent extends AbstractPropHandlerLayoutBuilderComponent {

  @Input()
  layoutEditor: JsfLayoutEditor;

  constructor(
    protected cdRef: ChangeDetectorRef,
    @SkipSelf() protected parentCdRef: ChangeDetectorRef
  ) {
    super(cdRef, parentCdRef);
  }

}
