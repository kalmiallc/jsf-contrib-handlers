import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef
}                                     from '@angular/core';
import {
  JsfLayoutOnClickInterface,
  JsfLayoutPropStringPreferences,
  JsfPropBuilderString,
  JsfPropLayoutBuilder
}                                     from '@kalmia/jsf-common-es2015';
import {
  ColorPickerBuilder,
  ColorPickerItem
}                                     from '../common/color-picker.builder';
import {
  AbstractPropHandlerComponent,
  colorUtils,
  jsfDefaultScrollOptions,
  OverlayScrollbarsService,
  ShowValidationMessagesDirective
}                                     from '@kalmia/jsf-app';
import { ColorPickerMessages }        from '../common/messages';
import Color                          from 'color';
import { DomSanitizer }               from '@angular/platform-browser';
import { takeUntil }                  from 'rxjs/operators';
import {
  Overlay,
  OverlayRef
}                                     from '@angular/cdk/overlay';
import { TemplatePortal }             from '@angular/cdk/portal';
import {
  merge,
  Subject
}                                     from 'rxjs';
import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger
}                                     from '@angular/animations';
import * as OverlayScrollbars         from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

interface ColorPickerOptions {
  mode: 'ral' | 'custom';
}

interface ColorPickerPreferences {
  variant?: 'tile' | 'popover-menu';

  /**
   * Maximum height of the color picker. Should the tiles exceed this value the container will become scrollable.
   */
  height?: string;
  /**
   * Minimum allowed tile size.
   */
  tileSize?: number;
  /**
   * Percentage value of width the tile's height should occupy.
   * For example, use '100' for a square tile, or '75' for a rectangular one.
   */
  tileHeightRatio?: number;
  /**
   * Padding between tiles.
   * Defaults to '2px'.
   */
  tilePadding?: string;
  /**
   * Desired amount of tiles per row. If left unspecified this value will be automatically determined based on the tile size.
   * Should the container size become smaller and not support this amount of tiles per row, the tiles will instead be moved into the next
   * row.
   */
  tilesPerRow?: number;
  /**
   * Should colors be searchable.
   */
  searchable?: boolean;
  /**
   * Hides color tile title.
   */
  hideTitleInTile?: boolean;
}

export const popoverMenuAnimations: {
  readonly transformMenu: AnimationTriggerMetadata;
} = {
  /**
   * This animation controls the menu panel's entry and exit from the page.
   *
   * When the menu panel is added to the DOM, it scales in and fades in its border.
   *
   * When the menu panel is removed from the DOM, it simply fades out after a brief
   * delay to display the ripple.
   */
  transformMenu: trigger('transformMenu', [
    state('void', style({
      opacity  : 0,
      transform: 'scale(0.8)'
    })),
    transition('void => enter', animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))),
    transition('* => void', animate('100ms linear', style({ opacity: 0 })))
  ])
};

@Component({
  selector       : 'app-color-picker',
  animations     : [popoverMenuAnimations.transformMenu],
  template       : `
      <div class="handler-common-color-picker jsf-animatable"
           [ngClass]="layoutSchema?.htmlClass || ''"
           [class.disabled]="disabled"
           [class.jsf-handler-color-picker-variant-tile]="isVariantTile()"
           [class.jsf-handler-color-picker-variant-popover-menu]="isVariantPopoverMenu()"
           [class.jsf-handler-color-picker-mode-ral]="isModeRal()"
           [class.jsf-handler-color-picker-mode-custom]="isModeCustom()">

          <!-- Variant: Tile -->
          <div *ngIf="isVariantTile()" class="color-picker-tile-wrapper">

              <!-- Search -->
              <div *ngIf="searchable">
                  <mat-form-field [color]="stringThemePreferences.color"
                                  [appearance]="stringThemePreferences.appearance"
                                  [class.jsf-mat-form-field-variant-standard]="isStringVariantStandard()"
                                  [class.jsf-mat-form-field-variant-small]="isStringVariantSmall()"
                                  class="mb-n2"
                                  jsfOutlineGapAutocorrect>
                      <mat-label *ngIf="title"
                                 [attr.for]="id">
                          {{ title }}
                      </mat-label>
                      <input matInput
                             type="search"
                             [(ngModel)]="search"
                             #searchInput="ngModel">

                      <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>

                  <!-- No items indicator -->
                  <div class="no-items" *ngIf="search && !colorValues.length">
                      <div class="rounded-sm __background-color--grey p-2">
                          <mat-icon class="d-block mx-auto __color--grey-dark">block</mat-icon>
                      </div>
                  </div>
              </div>

              <!-- RAL color picker -->
              <div *ngIf="isModeRal()"
                   [class.scrollable]="scrollable"
                   [class.border]="hasErrors"
                   [class.__border-color--warn]="hasErrors"
                   [class.invisible]="!elementVisible"
                   [style.max-height]="colorPickerHeight"
                   class="color-picker ral rounded-sm mt-n1">
                  <overlay-scrollbars [options]="scrollOptions"
                                      [style.max-height]="colorPickerHeight">
                      <div class="tile-wrapper">
                          <div class="tile-container" #tileContainer>
                              <!-- Color tile -->
                              <div *ngFor="let color of colorValues"
                                   class="tile"
                                   [matTooltip]="color.tooltip"
                                   [matTooltipDisabled]="!color.tooltip"
                                   (click)="selectColor(color.code, $event)"
                                   [style.width]="colorTileSize"
                                   [class.selected]="isColorSelected(color.code)"
                                   [class.light]="isLightColor(color.hex)"
                                   [class.super-light]="isSuperLight(color.hex)"
                                   [class.dark]="isDarkColor(color.hex)">
                                  <div class="tile-ratio-container"
                                       [style.padding-top.%]="handlerPreferences.tileHeightRatio">
                                      <div class="tile-content"
                                           [style.padding]="handlerPreferences.tilePadding">
                                          <div class="tile-background"
                                               [style.background-color]="color.hex">
                                              <div class="tile-selection-overlay __border-color--primary"></div>
                                              <div class="check-mark __background-color--primary __color--primary-contrast"
                                                   [class.visible]="isColorSelected(color.code)">
                                                  <mat-icon>check</mat-icon>
                                              </div>
                                          </div>
                                          <div class="tile-color-name no-text-selection">
                                              <span>RAL</span>
                                              <span>{{ color.code }}</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </overlay-scrollbars>
              </div>

              <!-- Custom color picker -->
              <div *ngIf="isModeCustom()"
                   [class.scrollable]="scrollable"
                   [class.border]="hasErrors"
                   [class.__border-color--warn]="hasErrors"
                   [class.invisible]="!elementVisible"
                   [style.max-height]="colorPickerHeight"
                   class="color-picker custom rounded-sm mt-n1">
                  <overlay-scrollbars [options]="scrollOptions"
                                      [style.max-height]="colorPickerHeight">
                      <div class="tile-wrapper">
                          <div class="tile-container" #tileContainer>
                              <!-- Color tile -->
                              <div *ngFor="let color of colorValues"
                                   class="tile"
                                   [matTooltip]="color.tooltip"
                                   [matTooltipDisabled]="!color.tooltip"
                                   (click)="selectColor(color.value, $event)"
                                   [style.width]="colorTileSize"
                                   [class.selected]="isColorSelected(color.value)"
                                   [class.light]="color.lightness ? color.lightness === 'light' : (color.color ? isLightColor(color.color) : true)"
                                   [class.super-light]="color.lightness ? color.lightness === 'superlight' : (color.color ? isSuperLight(color.color) : false)"
                                   [class.dark]="color.lightness ? color.lightness === 'dark' : (color.color ? isDarkColor(color.color) : false)">
                                  <div class="tile-ratio-container"
                                       [style.padding-top.%]="handlerPreferences.tileHeightRatio">
                                      <div class="tile-content"
                                           [style.padding]="handlerPreferences.tilePadding">
                                          <div class="tile-background"
                                               [style.background-image]="getBackgroundImageStyle(color.icon)"
                                               [style.background-color]="color.color || ''">

                                              <ng-container *ngIf="color.smallIcon">
                                                  <div class="tile-icon-small"
                                                       (click)="smallIconClick(color.smallIconOnClick, $event)"
                                                       [style.background-image]="getBackgroundImageStyle(color.smallIcon)">
                                                      <jsf-icon *ngIf="color.smallIconIcon" [icon]="color.smallIconIcon || 'info'"></jsf-icon>
                                                  </div>
                                              </ng-container>

                                              <ng-container *ngIf="color.smallIcon2">
                                                  <div class="tile-icon-small2"
                                                       (click)="smallIcon2Click(color.smallIcon2OnClick, $event)"
                                                       [style.background-image]="getBackgroundImageStyle(color.smallIcon2)">
                                                      <jsf-icon *ngIf="color.smallIcon2Icon" [icon]="color.smallIcon2Icon || 'info'"></jsf-icon>
                                                  </div>
                                              </ng-container>

                                              <ng-container *ngIf="color.zoomIcon">
                                                  <div class="tile-icon-zoom __background-color--primary __color--primary-contrast cursor-pointer"
                                                       [matTooltip]="i18n(color.zoomIcon.tooltip)"
                                                       [matTooltipDisabled]="!color.zoomIcon.tooltip"
                                                       (click)="zoomIconClick(color.zoomIcon.onClick, $event)">
                                                      <jsf-icon [icon]="color.zoomIcon.icon || 'zoom_in'"></jsf-icon>
                                                  </div>
                                              </ng-container>

                                              <div class="tile-selection-overlay __border-color--primary"></div>
                                              <div class="check-mark __background-color--primary __color--primary-contrast"
                                                   [class.visible]="isColorSelected(color.value)">
                                                  <mat-icon>check</mat-icon>
                                              </div>
                                          </div>
                                          <div class="tile-color-name no-text-selection">
                                              <span>{{ i18n(color.label) }}</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </overlay-scrollbars>
              </div>
          </div>

          <!-- Variant: Menu -->
          <div *ngIf="isVariantPopoverMenu()" class="color-picker-popover-menu-wrapper">
              <div class="color-picker-popover-menu-container rounded-sm __background-color--grey-light-50"
                   [class.has-errors]="hasErrors"
                   [class.__border-color--warn]="hasErrors"
                   [class.border]="hasErrors"
                   (click)="openPopoverMenu()"
                   matRipple
                   #popoverMenuContainer>
                  <div class="d-flex justify-content-between h-full">

                      <div class="color-picker-popover-menu-label-outer-wrapper ml-2">
                          <div class="color-picker-popover-menu-label-inner-wrapper d-flex flex-column justify-content-center h-full ">
                              <!-- Title -->
                              <div class="color-picker-title text-truncate" *ngIf="title">{{ i18n(title) }}</div>

                              <!-- Color name -->
                              <div class="color-picker-selected-color-label text-truncate" *ngIf="selectedColorValue">
                                  <span *ngIf="isModeRal()">RAL {{ i18n(selectedColorValue.code) }}</span>
                                  <span *ngIf="isModeCustom()">{{ i18n(selectedColorValue.label) }}</span>
                              </div>
                          </div>
                      </div>

                      <div class="d-flex flex-column justify-content-center h-full mr-2">
                          <!-- Selected color circle -->
                          <div class="selected-circle">
                              <div *ngIf="!selectedColorValue; else selectedColorTemplate"
                                   class="color-circle no-color __border-color--grey-dark-40 __color--grey-dark-40">
                              </div>

                              <ng-template #selectedColorTemplate>
                                  <div *ngIf="isModeRal()"
                                       class="color-circle"
                                       [class.light]="isLightColor(selectedColorValue.hex)"
                                       [class.super-light]="isSuperLight(selectedColorValue.hex)"
                                       [class.dark]="isDarkColor(selectedColorValue.hex)"
                                       [style.background-color]="selectedColorValue.hex">
                                  </div>

                                  <div *ngIf="isModeCustom()"
                                       class="color-circle"
                                       [class.light]="selectedColorValue.lightness ? selectedColorValue.lightness === 'light' : (selectedColorValue.color ? isLightColor(selectedColorValue.color) : true)"
                                       [class.super-light]="selectedColorValue.lightness ? selectedColorValue.lightness === 'superlight' : (selectedColorValue.color ? isSuperLight(selectedColorValue.color) : false)"
                                       [class.dark]="selectedColorValue.lightness ? selectedColorValue.lightness === 'dark' : (selectedColorValue.color ? isDarkColor(selectedColorValue.color) : false)"
                                       [style.background-image]="getBackgroundImageStyle(selectedColorValue.icon)"
                                       [style.background-color]="selectedColorValue.color || ''">
                                  </div>
                              </ng-template>
                          </div>
                      </div>
                  </div>
              </div>

              <ng-template #popoverMenuTemplate>
                  <div class="handler-common-color-picker-popover"
                       [@transformMenu]="_panelAnimationState"
                       (@transformMenu.start)="_onAnimationStart($event)"
                       (@transformMenu.done)="_onAnimationDone($event)">
                      <div class="p-3 __shadow-menu--black __background-color--white rounded">
                          <!-- Search -->
                          <div *ngIf="searchable">
                              <mat-form-field [color]="stringThemePreferences.color"
                                              [appearance]="stringThemePreferences.appearance"
                                              [class.jsf-mat-form-field-variant-standard]="isStringVariantStandard()"
                                              [class.jsf-mat-form-field-variant-small]="isStringVariantSmall()"
                                              class="mb-n2"
                                              jsfOutlineGapAutocorrect>
                                  <input matInput
                                         type="search"
                                         [(ngModel)]="search"
                                         #searchInput="ngModel">

                                  <mat-icon matSuffix>search</mat-icon>
                              </mat-form-field>

                              <!-- No items indicator -->
                              <div class="no-items" *ngIf="search && !colorValues.length">
                                  <div class="rounded-sm __background-color--grey p-2">
                                      <mat-icon class="d-block mx-auto __color--grey-dark">block</mat-icon>
                                  </div>
                              </div>
                          </div>

                          <!-- Custom color picker -->
                          <div *ngIf="isModeCustom()"
                               class="color-picker-popover-container custom">
                              <overlay-scrollbars [options]="scrollOptions"
                                                  [style.max-height]="colorPickerHeight">
                                  <div class="tile-wrapper"
                                       [style.min-width]="popoverMenuWrapperSize"
                                       [style.max-width]="popoverMenuWrapperSize">
                                      <div class="tile-container" #tileContainer>
                                          <ng-container *ngFor="let color of colorValues; let i = index">
                                              <!-- Color tile -->
                                              <div class="tile"
                                                   (click)="selectColor(color.value, $event); closePopoverMenu()"
                                                   [matTooltip]="color.tooltip"
                                                   [matTooltipDisabled]="!color.tooltip"
                                                   [style.width]="popoverMenuTileSize"
                                                   [class.selected]="isColorSelected(color.value)"
                                                   [class.light]="color.lightness ? color.lightness === 'light' : (color.color ? isLightColor(color.color) : true)"
                                                   [class.super-light]="color.lightness ? color.lightness === 'superlight' : (color.color ? isSuperLight(color.color) : false)"
                                                   [class.dark]="color.lightness ? color.lightness === 'dark' : (color.color ? isDarkColor(color.color) : false)">
                                                  <div class="tile-ratio-container"
                                                       [style.padding-top.%]="handlerPreferences.tileHeightRatio">
                                                      <div class="tile-content">
                                                          <div class="tile-background"
                                                               [style.background-image]="getBackgroundImageStyle(color.icon)"
                                                               [style.background-color]="color.color || ''">
                                                              <div class="tile-selection-overlay __border-color--primary"></div>
                                                              <div class="check-mark __background-color--primary __color--primary-contrast"
                                                                   [class.visible]="isColorSelected(color.value)">
                                                                  <mat-icon>check</mat-icon>
                                                              </div>
                                                          </div>

                                                          <div class="tile-color-name no-text-selection" *ngIf="!handlerPreferences.hideTitleInTile">
                                                              <span>{{ i18n(color.label) }}</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </ng-container>

                                          <ng-container *ngFor="let ghostTile of popoverMenuGhostTileCountIterator; trackBy: trackByFnGhostTiles">
                                              <div class="ghost-tile"
                                                   [style.width]="popoverMenuTileSize">
                                              </div>
                                          </ng-container>
                                      </div>
                                  </div>
                              </overlay-scrollbars>
                          </div>
                      </div>
                  </div>
              </ng-template>
          </div>

          <!-- Validation messages -->
          <jsf-error-messages *ngIf="hasErrors" [messages]="interpolatedErrors"></jsf-error-messages>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./color-picker.component.scss']
})
// tslint:disable-next-line:max-line-length
export class ColorPickerComponent extends AbstractPropHandlerComponent<JsfPropBuilderString, ColorPickerBuilder> implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

  @ViewChild(OverlayScrollbarsComponent, { static: false })
  osComponent: OverlayScrollbarsComponent;


  messages  = ColorPickerMessages;
  ralColors = colorUtils.getAllRalColors();

  public readonly scrollOptions: OverlayScrollbars.Options = {
    ...jsfDefaultScrollOptions,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    resize          : 'none',
    paddingAbsolute : true
  };

  private _search                         = void 0;
  private searchChange: EventEmitter<any> = new EventEmitter<any>();

  public get search(): any {
    return this._search;
  }

  public set search(x: any) {
    this._search = x;
    this.searchChange.emit(x);
  }


  @ViewChild('tileContainer', { read: ElementRef, static: false })
  tileContainer: ElementRef;

  @ViewChild('popoverMenuContainer', { read: ElementRef, static: false })
  popoverMenuContainer: ElementRef;

  @ViewChild('popoverMenuTemplate', { read: TemplateRef, static: false })
  popoverMenuTemplate: TemplateRef<any>;

  /** Current state of the panel animation. */
  _panelAnimationState: 'void' | 'enter' = 'void';
  /** Emits whenever an animation on the menu completes. */
  _animationDone                         = new Subject<AnimationEvent>();
  /** Whether the menu is animating. */
  _isAnimating: boolean;

  private overlayRef: OverlayRef;

  private elementVisibilityInterval;
  public elementVisible = false;

  private _colorTileSize: number;
  private _popoverMenuGhostTileCountIterator: number[] = [];

  private _colorValues: any[] = [];

  get colorTileSize(): string {
    return `${ this._colorTileSize }%`;
  }

  get popoverMenuTileSize(): string {
    return `${ this.handlerPreferences.tileSize }px`;
  }

  get popoverMenuWrapperSize(): string {
    return this.handlerPreferences.tilesPerRow ? `${ this.handlerPreferences.tilesPerRow * this.handlerPreferences.tileSize }px` : 'auto';
  }

  get popoverMenuGhostTileCount(): number {
    if (!this.tileContainer) {
      return;
    }

    const childNodes                    = (this.tileContainer.nativeElement as HTMLElement).children;
    const tileChildNodes: HTMLElement[] = [];

    // First we have to filter out all ghost tiles
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < childNodes.length; i++) {
      if (!childNodes[i].classList.contains('ghost-tile')) {
        tileChildNodes.push(childNodes[i] as any);
      }
    }

    // Count the number of tiles per row
    let rowElementCount = 0;
    let compareOffset   = null;
    for (let i = 0; i < tileChildNodes.length; i++) {
      const child: HTMLElement = tileChildNodes[i];

      const childOffset = child.offsetTop;
      if (i === 0) {
        compareOffset = childOffset;
      } else {
        if (childOffset - compareOffset > this.handlerPreferences.tileSize / 2) {
          // New row detected
          break;
        }
      }
      rowElementCount++;
    }

    // Calculate the amount of missing tiles
    return tileChildNodes.length % rowElementCount !== 0 ? (rowElementCount - (tileChildNodes.length % rowElementCount)) : 0;
  }

  get popoverMenuGhostTileCountIterator() {
    return this._popoverMenuGhostTileCountIterator;
  }

  get popoverMenuTilesPerRow(): number {
    return this.handlerPreferences.tilesPerRow;
  }

  get colorValues(): any[] {
    return this._colorValues;
  }

  get selectedColorValue(): any {
    if (this.isModeRal()) {
      return this.colorValues.find(x => x.code === this.value);
    } else if (this.isModeCustom()) {
      return this.colorValues.find(x => x.value === this.value);
    }
  }

  get colorPickerHeight(): string {
    return this.handlerPreferences.height || null;
  }

  get items(): ColorPickerItem[] {
    return this.handlerBuilder.items;
  }

  get scrollable(): boolean {
    return this.colorPickerHeight !== null;
  }

  get searchable(): boolean {
    return this.handlerPreferences.searchable || false;
  }

  get title(): string {
    return this.propBuilder.prop.title;
  }

  constructor(protected cdRef: ChangeDetectorRef,
              @Optional() protected showValidation: ShowValidationMessagesDirective,
              protected sanitizer: DomSanitizer,
              protected overlay: Overlay,
              private osService: OverlayScrollbarsService,
              protected vcr: ViewContainerRef) {
    super(cdRef, showValidation);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.isVariantTile()) {
      this.updateColorTileSize();
    }

    if (this.isVariantPopoverMenu()) {
      setTimeout(() => {
        this.updatePopoverMenuGhostTileCountIterator();
      }, 0);
    }
  }

  trackByFnGhostTiles(index, item) {
    return index;
  }

  private updatePopoverMenuGhostTileCountIterator() {
    const items     = [];
    const tileCount = this.popoverMenuGhostTileCount;
    for (let i = 0; i < tileCount; i++) {
      items.push(i);
    }
    this._popoverMenuGhostTileCountIterator = items;
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.updateColorItems();
    this.cdRef.detectChanges();

    this.handlerBuilder.itemsChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateColorItems();
        this.cdRef.detectChanges();

        setTimeout(() => {
          if (this.isVariantPopoverMenu()) {
            this.updatePopoverMenuGhostTileCountIterator();
          }
          this.cdRef.detectChanges();
        });
      });

    if (this.handlerBuilder.itemsProvider) {
      this.handlerBuilder.itemsProvider.statusChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.updateColorItems();
          this.cdRef.detectChanges();

          setTimeout(() => {
            if (this.isVariantPopoverMenu()) {
              this.updatePopoverMenuGhostTileCountIterator();
            }
            this.cdRef.detectChanges();
          });
        });
    }

    if (this.isVariantTile()) {
      this.elementVisibilityInterval = setInterval(this.checkVisibilityState.bind(this), 50);
    }

    this.searchChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateColorItems();
        this.cdRef.detectChanges();

        setTimeout(() => {
          if (this.isVariantPopoverMenu()) {
            this.updatePopoverMenuGhostTileCountIterator();
          }
          this.cdRef.detectChanges();
        });
      });

    this._animationDone
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: AnimationEvent) => {
        if (this._panelAnimationState === 'void') {
          if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = void 0;
          }
        } else {
          if (this.isVariantPopoverMenu()) {
            this.updatePopoverMenuGhostTileCountIterator();
            this.cdRef.detectChanges();
          }
        }
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.elementVisibilityInterval) {
      clearInterval(this.elementVisibilityInterval);
      this.elementVisibilityInterval = void 0;
    }

    this.osService.deregisterOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  ngAfterViewInit(): void {
    // Bug: we have to use setTimeout here to allow some time for the DOM to update, or we can't get the actual element size.
    // If the component looks strange when you first load it, this right here is probably the reason why. You should add an additional
    // call do the updateColorTileSize() function a bit later to refresh the tile sizes.
    if (this.isVariantTile()) {
      setTimeout(() => {
        this.updateColorTileSize();
      }, 0);
    }

    this.osService.registerOverlayScrollbarsInstance(this.osComponent?.osInstance());
  }

  checkVisibilityState() {
    if (!this.tileContainer) {
      return;
    }
    const e = this.tileContainer.nativeElement as HTMLElement;
    if (this.elementVisible !== !!e.offsetParent) {
      this.elementVisible = !!e.offsetParent;
      this.updateColorTileSize();
    }
  }

  updateColorItems() {
    switch (this.options.mode) {
      case 'ral': {
        if (this.items && this.items.length) {
          this._colorValues = this.ralColors.filter(x => !!this.items.find(v => v.value === x.code));
        } else {
          this._colorValues = this.ralColors;
        }
        // Filter by search string.
        this._colorValues = this.search
          ? this._colorValues.filter(x => x.code.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0)
          : this._colorValues;
        break;
      }
      case 'custom': {
        this._colorValues = this.handlerBuilder.items;
        // Filter by search string.
        this._colorValues = this.search
          ? this._colorValues.filter(x => x.label.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0)
          : this._colorValues;
      }
    }
  }

  updateColorTileSize() {
    const containerSize    = (this.tileContainer.nativeElement as HTMLElement).getBoundingClientRect();
    const totalWidth       = containerSize.width;
    const colorValuesCount = (this._colorValues || []).length;

    let tilesPerRow;
    if (this.handlerPreferences.tilesPerRow) {
      let desiredTilesPerRow = this.handlerPreferences.tilesPerRow;

      if (colorValuesCount >= desiredTilesPerRow && desiredTilesPerRow * this.handlerPreferences.tileSize > totalWidth) {
        desiredTilesPerRow   = Math.max(1, Math.floor(totalWidth / this.handlerPreferences.tileSize));
        const remainingWidth = totalWidth - (desiredTilesPerRow * this.handlerPreferences.tileSize);

        const sizePx        = this.handlerPreferences.tileSize + remainingWidth / desiredTilesPerRow;
        this._colorTileSize = (sizePx / totalWidth) * 100;
      } else {
        const sizePx        = totalWidth / desiredTilesPerRow;
        this._colorTileSize = (sizePx / totalWidth) * 100;
      }
    } else {
      tilesPerRow = Math.min(Math.floor(totalWidth / this.handlerPreferences.tileSize), colorValuesCount);

      const remainingWidth = totalWidth - (tilesPerRow * this.handlerPreferences.tileSize);

      const sizePx        = this.handlerPreferences.tileSize + (tilesPerRow === 0 ? remainingWidth : remainingWidth / tilesPerRow);
      this._colorTileSize = (sizePx / totalWidth) * 100;
    }

    this.cdRef.detectChanges();
  }

  selectColor(color: any, $event: any) {
    if (this.disabled) {
      return;
    }

    this.value = color;

    this.layoutBuilder.onClick($event)
      .catch(e => {
        console.error(e);
        throw e;
      });
  }

  zoomIconClick(clickData: JsfLayoutOnClickInterface | JsfLayoutOnClickInterface[], $event: MouseEvent) {
    if (!clickData) {
      return;
    }

    if (this.disabled) {
      return;
    }

    this.layoutBuilder.handleOnClick(clickData, $event)
      .catch(e => {
        console.error(e);
        throw e;
      });

    $event.stopPropagation();
  }

  smallIconClick(clickData: JsfLayoutOnClickInterface | JsfLayoutOnClickInterface[], $event: MouseEvent) {
    if (!clickData) {
      return;
    }

    if (this.disabled) {
      return;
    }

    this.layoutBuilder.handleOnClick(clickData, $event)
      .catch(e => {
        console.error(e);
        throw e;
      });

    $event.stopPropagation();
  }

  smallIcon2Click(clickData: JsfLayoutOnClickInterface | JsfLayoutOnClickInterface[], $event: MouseEvent) {
    if (!clickData) {
      return;
    }

    if (this.disabled) {
      return;
    }

    this.layoutBuilder.handleOnClick(clickData, $event)
      .catch(e => {
        console.error(e);
        throw e;
      });

    $event.stopPropagation();
  }

  isColorSelected(color: any) {
    return this.value === color;
  }

  isLightColor(hex: string): boolean {
    return Color(hex).isLight();
  }

  // Used for determining if a border is required
  isSuperLight(hex: string): boolean {
    return Color(hex).lightness() >= 90;
  }

  isDarkColor(hex: string): boolean {
    return !this.isLightColor(hex);
  }

  getBackgroundImageStyle(url: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url('${ url }')`);
  }

  openPopoverMenu() {
    if (this.disabled) {
      return;
    }

    if (!this.popoverMenuContainer) {
      throw new Error(`Missing popover menu container.`);
    }

    if (!this.popoverMenuTemplate) {
      throw new Error(`Missing popover menu template.`);
    }

    // Create and configure overlay
    this.overlayRef = this.overlay.create({
      // Position strategy defines where popup will be displayed
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.popoverMenuContainer)
        .withPositions([{
          originX : 'center',
          originY : 'bottom',
          overlayX: 'center',
          overlayY: 'top'
        }
        ])
        .withTransformOriginOn('.color-picker-popover')
        .withViewportMargin(10)
        .withPush(true)
        .withGrowAfterOpen(true),
      // Popup reposition on scroll
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),
      // Use transparent backdrop
      hasBackdrop     : true,
      backdropClass   : 'cdk-overlay-transparent-backdrop'
    });

    // Put template to a portal
    const templatePortal = new TemplatePortal(this.popoverMenuTemplate, this.vcr);

    // Attach the portal to the overlay
    this.overlayRef.attach(templatePortal);

    // Start the menu animation
    this._startAnimation();

    // Handle closing
    merge(
      this.overlayRef.backdropClick(),
      this.overlayRef.detachments()
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.closePopoverMenu();
      });
  }

  closePopoverMenu() {
    this._resetAnimation();
  }

  /** Starts the enter animation. */
  _startAnimation() {
    this._panelAnimationState = 'enter';
    this.cdRef.detectChanges();
  }

  /** Resets the panel animation to its initial state. */
  _resetAnimation() {
    this._panelAnimationState = 'void';
    this.cdRef.detectChanges();
  }

  /** Callback that is invoked when the panel animation completes. */
  _onAnimationDone(event: AnimationEvent) {
    this._animationDone.next(event);
    this._isAnimating = false;
  }

  _onAnimationStart(event: AnimationEvent) {
    this._isAnimating = true;
  }

  get options(): ColorPickerOptions {
    return this.handlerBuilder.options;
  }

  get handlerPreferences(): ColorPickerPreferences {
    return {
      /* Defaults */
      variant: 'tile',

      height         : null,
      tileSize       : 46,
      tileHeightRatio: 100,
      tilePadding    : '2px',
      tilesPerRow    : null,
      hideTitleInTile: false,
      searchable     : false,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as ColorPickerPreferences;
  }

  get stringThemePreferences(): JsfLayoutPropStringPreferences {
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
      ...(this.globalThemePreferences ? this.globalThemePreferences.string : {})
    } as JsfLayoutPropStringPreferences;
  }

  isVariantTile        = () => this.handlerPreferences.variant === 'tile';
  isVariantPopoverMenu = () => this.handlerPreferences.variant === 'popover-menu';

  isModeRal    = () => this.options.mode === 'ral';
  isModeCustom = () => this.options.mode === 'custom';

  isStringVariantStandard = () => this.stringThemePreferences.variant === 'standard';
  isStringVariantSmall    = () => this.stringThemePreferences.variant === 'small';

}
