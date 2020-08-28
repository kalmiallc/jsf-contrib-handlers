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
import { ChipListMessages }                             from './messages';
import { compact, isEqual, isNil, isPlainObject, uniq } from 'lodash';
import { Observable, Subject, Subscription }            from 'rxjs';
import { takeUntil }                                    from 'rxjs/operators';
import { jsfHandlerChipListDropdownCompatibility }      from './chip-list.jsf';


// tslint:disable-next-line:max-line-length
export class HandlerChipListBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderArray> {

  type = 'common/dropdown';

  onInit() {
    super.onInit();
  }

  onDestroy(): void {
    super.onDestroy();
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

    return messages;
  }

  getStaticTranslatableStrings(): JsfTranslatableMessage[] {
    const messages: JsfTranslatableMessage[] = [];

    for (const key of Object.keys(ChipListMessages)) {
      messages.push(new JsfTranslatableMessage(ChipListMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler(
  'common/chip-list',
  HandlerChipListBuilder,
  jsfHandlerChipListDropdownCompatibility
);
