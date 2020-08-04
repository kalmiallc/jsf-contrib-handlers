import {
  isI18nObject,
  JsfBasicHandlerBuilder,
  JsfPropBuilderObject,
  JsfRegister,
  JsfTranslatableMessage, MaximumValidationError
}                                            from '@kalmia/jsf-common-es2015';
import { ButtonToggleAllNoneCustomMessages } from './messages';
import { jsfHandlerCommonButtonToggleAllNoneCustomCompatibility } from './button-toggle-all-none-custom.jsf';


export interface ButtonToggleAllNoneCustomOptions {
  dependsOn: string;
}

export class ButtonToggleAllNoneCustomBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderObject> {

  type = 'common/button-toggle-all-none-custom';

  constructor(builder: any) { // FIXME
    super(builder);
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

    return messages;
  }

  getStaticTranslatableStrings(): JsfTranslatableMessage[] {
    const messages: JsfTranslatableMessage[] = [];

    for (const key of Object.keys(ButtonToggleAllNoneCustomMessages)) {
      messages.push(new JsfTranslatableMessage(ButtonToggleAllNoneCustomMessages[key]));
    }

    return messages;
  }

  get options(): ButtonToggleAllNoneCustomOptions {
    return {
      ...(this.builder.prop.handler.options || {})
    } as ButtonToggleAllNoneCustomOptions;
  }

}

JsfRegister.handler('common/button-toggle-all-none-custom', ButtonToggleAllNoneCustomBuilder, jsfHandlerCommonButtonToggleAllNoneCustomCompatibility);
