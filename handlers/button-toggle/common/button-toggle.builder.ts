import {
  Bind,
  isI18nObject,
  isJsfProviderExecutor,
  JsfBasicHandlerBuilder,
  JsfPropBuilderArray,
  JsfPropBuilderInteger,
  JsfPropBuilderNumber,
  JsfPropBuilderString,
  JsfProviderConsumer,
  JsfProviderExecutor,
  JsfProviderExecutorInterface,
  JsfProviderExecutorStatus,
  JsfRegister,
  JsfTranslatableMessage,
  JsfUnknownPropBuilder,
  PropStatus,
  PropStatusChangeInterface
}                                                        from '@kalmia/jsf-common-es2015';
import { Observable, Subject, Subscription }             from 'rxjs';
import { differenceWith, isEqual, isNil, isPlainObject } from 'lodash';
import { jsfHandlerCommonButtonToggleCompatibility }     from './button-toggle.jsf';
import { takeUntil }                                     from 'rxjs/operators';

export interface ButtonToggleItem {
  value: any;
  label: string;
  icon?: string;

  /**
   * @deprecated
   */
  enabledIf?: {
    $eval: string;

    // use handler.dependencies instead
    // dependencies: string[];
  };
}

export function isButtonToggleItem(item: any): item is ButtonToggleItem {
  return typeof item === 'object' && 'value' in item && 'label' in item;
}

export class ButtonToggleBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderString |
                                                                JsfPropBuilderNumber |
                                                                JsfPropBuilderInteger |
                                                                JsfPropBuilderArray> {
  type = 'common/button-toggle';

  private _items: ButtonToggleItem[];
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
    if (this.builder.rootBuilder.ready) {
      this.createItems();
    }
  }

  get items(): ButtonToggleItem[] {
    return this._items;
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
    const ctx   = this.builder.rootBuilder.getEvalContext({
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
            const depCtx   = this.builder.rootBuilder.getEvalContext({
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
      if (!isButtonToggleItem(x)) {
        return {
          label: x,
          value: x
        } as ButtonToggleItem;
      }

      return x;
    });

    this.itemsUpdated();
  }

  private createStaticItems(items: any[]) {
    this._items = items.map(x => {
      if (!isButtonToggleItem(x)) {
        return {
          label: x,
          value: x
        } as ButtonToggleItem;
      }

      return x;
    });

    this.itemsUpdated();
  }

  private itemsUpdated() {
    this._itemsChanged.next();

    const currentValue = this.builder.getJsonValue();

    if (isNil(currentValue)) {
      return;
    }

    if (this.builder.prop.type === 'array') {
      const currentArrayValue = Array.isArray(currentValue) ? currentValue : [];

      // Case where value is an array
      const newItems = currentArrayValue.filter(x => this.items.find(y => isEqual(x, y.value)) !== void 0);
      const changes  = differenceWith(currentArrayValue, [newItems], (a, b) => isEqual(a, b));

      if (changes.length) {
        (this.builder as JsfUnknownPropBuilder).setJsonValue(newItems)
          .catch(e => {
            console.error(e);
            throw e;
          });
      }
    } else {
      const containedItem = this.items.find(x => isEqual(x.value, currentValue));
      if (containedItem === void 0) {
        (this.builder as JsfUnknownPropBuilder).setJsonValue(null)
          .catch(e => {
            console.error(e);
            throw e;
          });
      }
    }
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
    const values = this.items;
    for (const value of values) {
      messages.push(new JsfTranslatableMessage(value.label));
    }

    return messages;
  }

  findItemByValue(value: any): ButtonToggleItem {
    return this.items.find(x => x.value === value);
  }
}

JsfRegister.handler('common/button-toggle', ButtonToggleBuilder, jsfHandlerCommonButtonToggleCompatibility);
