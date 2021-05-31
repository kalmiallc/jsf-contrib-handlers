import {
  AddOrRemoveItemValueOptionsInterface, Bind,
  isI18nObject, isJsfProviderExecutor,
  JsfBasicHandlerBuilder,
  JsfPropBuilderString, JsfProviderConsumer,
  JsfProviderExecutor, JsfProviderExecutorInterface, JsfProviderExecutorStatus,
  JsfRegister,
  JsfTranslatableMessage, JsfUnknownPropBuilder, PropStatus, PropStatusChangeInterface
}                                            from '@kalmia/jsf-common-es2015';
import { ColorPickerMessages }               from './messages';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil }                         from 'rxjs/internal/operators';
import { isPlainObject, isNil, isEqual }     from 'lodash';
import { JsfLayoutOnClickInterface }         from '@kalmia/jsf-common-es2015';
import { jsfHandlerCommonColorPickerCompatibility } from './color-picker.jsf';

export interface ColorPickerItem {
  value: any;
  label?: string;
  color?: string;
  icon?: string;
  smallIcon?: string;
  smallIcon2?: string;
  smallIconOnClick?: JsfLayoutOnClickInterface | JsfLayoutOnClickInterface[];
  smallIcon2OnClick?: JsfLayoutOnClickInterface | JsfLayoutOnClickInterface[];
  zoomIcon?: {
    icon?: string;
    tooltip?: string;
    onClick?: JsfLayoutOnClickInterface | JsfLayoutOnClickInterface[]
  };

  /**
   * Setting this will override automatic color lightness detection
   */
  lightness?: 'light' | 'superlight' | 'dark';
}

export function isColorPickerItem(item: any): item is ColorPickerItem {
  return typeof item === 'object' && 'value' in item;
}

export class ColorPickerBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderString> {

  type = 'common/color-picker';

  private _items: ColorPickerItem[];
  itemsProvider: JsfProviderExecutor;

  private subscriptions: Subscription[] = [];

  private _itemsChanged = new Subject<void>();
  get itemsChanged(): Observable<void> {
    return this._itemsChanged.asObservable();
  }

  onInit() {
    super.onInit();

    this.builder.rootBuilder.formInit
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.createItems();
      });
  }

  onDestroy(): void {
    super.onDestroy();
    this.clearSubscriptions();
  }

  private clearSubscriptions() {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.subscriptions = [];
  }

  afterDynamicInit() {
    this.createItems();
  }

  get items(): ColorPickerItem[] {
    return this._items;
  }

  async getPropTranslatableStrings(): Promise<JsfTranslatableMessage[]> {
    const messages: JsfTranslatableMessage[] = [];

    if (this.builder.prop.title) {
      messages.push(isI18nObject(this.builder.prop.title) ?
        new JsfTranslatableMessage(this.builder.prop.title.val, this.builder.prop.title.id) :
        new JsfTranslatableMessage(this.builder.prop.title));
    }

    if (this.builder.prop.description) {
      messages.push(isI18nObject(this.builder.prop.description) ?
        new JsfTranslatableMessage(this.builder.prop.description.val, this.builder.prop.description.id) :
        new JsfTranslatableMessage(this.builder.prop.description));
    }

    // Values
    const values = this.items || [];
    for (const value of values) {
      messages.push(new JsfTranslatableMessage(value.label || value.value));
    }

    return messages;
  }

  private createItems() {
    const values = (this.builder.prop.handler as any).values;

    if (isPlainObject(values)) {
      if (values.provider) {
        if (!isJsfProviderExecutor(values.provider)) {
          throw new Error(`Invalid 'provider' format.`);
        }

        return this.createProvidedItems(values.provider);
      } else if (values.$eval) {
        return this.createEvalItems(values);
      }
    } else if (Array.isArray(values)) {
      this.createStaticItems(values || []);
    } else {
      // Normally we would throw here because no items were provided, however in case of "ral" picker mode this is a legitimate case.
      this.createStaticItems([]);
    }
  }

  private createEvalItems(values: { $eval: string, dependencies: string[] }) {
    this.clearSubscriptions();

    // Get initial items
    const ctx = this.builder.rootBuilder.getEvalContext({
      propBuilder: this.builder
    });
    const items = this.builder.rootBuilder.runEvalWithContext((values as any).$evalTranspiled || values.$eval, ctx);
    this.createStaticItems(items);

    // Subscribe to dependencies and update items when required.
    const deps = values.dependencies || [];

    for (const dependency of deps) {
      const dependencyAbsolutePath = this.builder.convertAbstractSiblingPathToPath(dependency);
      this.subscriptions.push(
        this.builder.rootBuilder.listenForStatusChange(dependencyAbsolutePath).subscribe(async (status: PropStatusChangeInterface) => {
          if (status.status !== PropStatus.Pending) {
            const depCtx = this.builder.rootBuilder.getEvalContext({
              propBuilder: this.builder
            });
            const depItems = this.builder.rootBuilder.runEvalWithContext((values as any).$evalTranspiled || values.$eval, depCtx);
            this.createStaticItems(depItems);
          }
        })
      );
    }
  }

  private createProvidedItems(executor: JsfProviderExecutorInterface) {
    this.itemsProvider = new JsfProviderExecutor(
      this.builder.rootBuilder,
      executor,
      new JsfProviderConsumer(this.applyProvidedItems),
      this.builder
    );

    this.itemsProvider.onInit();
    this.itemsProvider.provideImmediately().catch(console.error);

    this.itemsProvider.statusChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((status: JsfProviderExecutorStatus) => {
        this.builder.resolve().catch(console.error);
      });
  }

  @Bind()
  private async applyProvidedItems(jsonValue: any) {
    if (!Array.isArray(jsonValue)) {
      throw new Error(`Returned items value should be an array.`);
    }

    this._items = jsonValue.map(x => {
      if (!isColorPickerItem(x)) {
        return {
          label: x,
          value: x
        } as ColorPickerItem;
      }

      return x;
    });

    this.itemsUpdated();
  }

  private createStaticItems(items: any[]) {
    this._items = items.map(x => {
      if (!isColorPickerItem(x)) {
        return {
          label: x,
          value: x
        } as ColorPickerItem;
      }

      return x;
    });

    this.itemsUpdated();
  }

  private itemsUpdated() {
    this._itemsChanged.next();

    const currentValue  = this.builder.value;

    if (isNil(currentValue)) {
      return;
    }

    // Skip the contained items check if we are in ral mode and no items were provided.
    if (this.options.mode === 'ral' && this.items && !this.items.length) {
      return;
    }

    const containedItem = this.items.find(x => isEqual(x.value, currentValue));
    if (containedItem === void 0) {
      (this.builder as JsfUnknownPropBuilder).setJsonValue(null)
        .catch(e => {
          throw e;
        });
    }
  }

  get options() {
    return {
      mode: 'ral',

      ...(this.builder.prop.handler.options || {})
    };
  }

  findItemByValue(value: any): ColorPickerItem {
    return this.items.find(x => x.value === value);
  }

  getStaticTranslatableStrings(): JsfTranslatableMessage[] {
    const messages: JsfTranslatableMessage[] = [];

    for (const key of Object.keys(ColorPickerMessages)) {
      messages.push(new JsfTranslatableMessage(ColorPickerMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler('common/color-picker', ColorPickerBuilder, jsfHandlerCommonColorPickerCompatibility);
