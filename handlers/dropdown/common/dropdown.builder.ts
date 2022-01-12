import {
  Bind,
  isI18nObject,
  isJsfProviderExecutor,
  JsfBasicHandlerBuilder,
  JsfPropBuilderArray, JsfPropBuilderId,
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
}                                                       from '@kalmia/jsf-common-es2015';
import { DropdownMessages }                             from './messages';
import { compact, isEqual, isNil, isPlainObject, uniq } from 'lodash';
import { Observable, Subject, Subscription }            from 'rxjs';
import { takeUntil }                                    from 'rxjs/operators';
import { jsfHandlerCommonDropdownCompatibility }        from './dropdown.jsf';


export interface DropdownOptions {
  updatePropOnValuesListChange: boolean;
}

export interface DropdownItem {
  value: any;
  label: string;
  /**
   * @deprecated
   */
  enabledIf?: {
    $eval: string,
    dependencies: string[]
  };
}

export function isDropdownItem(item: any): item is DropdownItem {
  return typeof item === 'object' && 'value' in item && 'label' in item;
}


// tslint:disable-next-line:max-line-length
export class HandlerDropdownBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderString | JsfPropBuilderNumber | JsfPropBuilderInteger | JsfPropBuilderId | JsfPropBuilderArray> {

  type = 'common/dropdown';

  private _items: DropdownItem[];
  itemsProvider: JsfProviderExecutor;

  private subscriptions: Subscription[] = [];

  private _itemsChanged = new Subject<void>();
  get itemsChanged(): Observable<void> {
    return this._itemsChanged.asObservable();
  }

  get isArray(): boolean {
    return this.builder.prop.type === 'array';
  }

  get options(): DropdownOptions {
    return {
      updatePropOnValuesListChange: true,

      ...(this.builder.prop.handler.options || {})
    };
  }

  public update$: Subject<void> = new Subject<void>();

  onInit() {
    super.onInit();

    this.builder.rootBuilder.formInit
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.createItems();
        this.update$.next();
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
    this.update$.next();
  }

  /**
   * Translations
   */
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
      messages.push(new JsfTranslatableMessage(value.label || value.value));
    }

    return messages;
  }

  get items(): DropdownItem[] {
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

      // Subscribe to enabledIf changes.
      this.clearSubscriptions();

      const deps = this.getItemsDependencies(values);
      if (!deps.length) {
        return;
      }

      for (const dependency of deps) {
        if (this.builder.rootBuilder.warnings) {
          console.warn(`Handler "common/dropdown" [${ this.builder.path }] is using deprecated "enabledIf" property on items. Use an "$eval" property instead.`);
        }
        const dependencyAbsolutePath = this.builder.convertAbstractSiblingPathToPath(dependency);
        this.subscriptions.push(
          this.builder.rootBuilder.listenForStatusChange(dependencyAbsolutePath).subscribe(async (status: PropStatusChangeInterface) => {
            if (status.status !== PropStatus.Pending) {
              this.createStaticItems(values || []);
            }
          })
        );
      }
    } else {
      throw new Error(`Unsupported values property.`);
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
      if (!isDropdownItem(x)) {
        return {
          label: x,
          value: x
        } as DropdownItem;
      }

      return x;
    });

    this.itemsUpdated();
  }

  private createStaticItems(items: any[]) {
    this._items = items.map(x => {
      if (!isDropdownItem(x)) {
        return {
          label: x,
          value: x
        } as DropdownItem;
      }

      return x;
    }).filter(x => {
      // In case of dropdown item object, run evals if item has enabledIf property
      if (!this.builder.enabled) {
        return true;
      }

      // tslint:disable
      if (x.enabledIf === void 0) {
        return true;
      }

      if (typeof x.enabledIf !== 'object') {
        return !!x.enabledIf;
      }

      const ctx = this.builder.rootBuilder.getEvalContext({
        propBuilder: this.builder
      });
      return this.builder.rootBuilder.runEvalWithContext(
        (x.enabledIf as any).$evalTranspiled || x.enabledIf.$eval, ctx);
    });

    this._items = this._items.map(x => {
      return {
        ... x,
        label: this.translationServer.get(x.label)
      };
    });

    this.itemsUpdated();
  }

  private itemsUpdated() {
    this._itemsChanged.next();

    if (!this.options.updatePropOnValuesListChange) {
      return;
    }

    // Filter prop value from possible dropdown values.
    if (this.isArray) {
      // Array
      const currentValue = (this.builder as JsfPropBuilderArray).getJsonValue();
      if (isNil(currentValue)) {
        return;
      }

      const filteredItems = currentValue.filter(x => !!this.items.find(item => isEqual(item.value, x)));
      const options       = this.builder.isAlreadyScheduledForResolver ? {
        noResolve    : true,
        noValueChange: true
      } : {};
      (this.builder as JsfUnknownPropBuilder).setJsonValue(filteredItems, options)
        .catch(e => {
          console.error(e);
          throw e;
        });

      this.update$.next();
    } else {
      // Everything else
      const currentValue = (this.builder as any).getJsonValue();

      if (isNil(currentValue)) {
        return;
      }

      const containedItem = this.items.find(x => isEqual(x.value, currentValue));
      if (containedItem === void 0) {
        const options = this.builder.isAlreadyScheduledForResolver ? {
          noResolve    : true,
          noValueChange: true
        } : {};
        (this.builder as JsfUnknownPropBuilder).setJsonValue(null, options)
          .catch(e => {
            console.error(e);
            throw e;
          });

        this.update$.next();
      }
    }
  }

  // Calling this assumes that we are using static items!
  private getItemsDependencies(values: any[]) {
    const dependencies = [];

    for (const item of values) {
      if (isDropdownItem(item)) {
        if (item.enabledIf) {
          dependencies.push(...(item.enabledIf.dependencies || []));
        }
      }
    }

    return uniq(compact(dependencies));
  }


  findItemByValue(value: any): DropdownItem {
    return this.items?.find(x => isEqual(x.value, value));
  }

  getStaticTranslatableStrings(): JsfTranslatableMessage[] {
    const messages: JsfTranslatableMessage[] = [];

    for (const key of Object.keys(DropdownMessages)) {
      messages.push(new JsfTranslatableMessage(DropdownMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler(
  'common/dropdown',
  HandlerDropdownBuilder,
  jsfHandlerCommonDropdownCompatibility
);
