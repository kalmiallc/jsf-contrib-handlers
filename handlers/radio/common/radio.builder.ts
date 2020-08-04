import { isI18nObject, JsfBasicHandlerBuilder, JsfPropBuilderString, JsfRegister, JsfTranslatableMessage } from '@kalmia/jsf-common-es2015';
import { RadioMessages }                                                                                   from './messages';
import { jsfHandlerCommonRadioCompatibility }                                                               from './radio.jsf';

export interface RadioItem {
  value: any;
  label: string;
  tooltip?: string;
}

export function isRadioItem(item: any): item is RadioItem {
  return typeof item === 'object' && 'value' in item && 'label' in item;
}

export class HandlerRadioBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderString> {

  type = 'common/radio';

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
      messages.push(new JsfTranslatableMessage(value.label));
    }

    return messages;
  }

  get items(): RadioItem[] {

    const items = (this.builder.prop.handler as any).values || [];

    return items.map(x => {
      if (!isRadioItem(x)) {
        return {
          label: x,
          value: x
        } as RadioItem;
      }
      return x;
    });
  }

  findItemByValue(value: any): RadioItem {
    return this.items.find(x => x.value === value);
  }

  getStaticTranslatableStrings(): JsfTranslatableMessage[] {
    const messages: JsfTranslatableMessage[] = [];

    for (const key of Object.keys(RadioMessages)) {
      messages.push(new JsfTranslatableMessage(RadioMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler('common/radio', HandlerRadioBuilder, jsfHandlerCommonRadioCompatibility);
