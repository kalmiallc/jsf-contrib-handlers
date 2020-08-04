import {
  isI18nObject,
  JsfBasicHandlerBuilder,
  JsfPropBuilderObject,
  JsfRegister,
  JsfTranslatableMessage, MaximumValidationError
}                                            from '@kalmia/jsf-common-es2015';
import { ButtonToggleUnknownCustomMessages } from './messages';
import { jsfHandlerCommonButtonToggleUnknownCustomCompatibility } from './button-toggle-unknown-custom.jsf';


export interface ButtonToggleUnknownCustomOptions {
  dependsOn: string;
}

export class ButtonToggleUnknownCustomBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderObject> {

  type = 'common/button-toggle-unknown-custom';

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

    for (const key of Object.keys(ButtonToggleUnknownCustomMessages)) {
      messages.push(new JsfTranslatableMessage(ButtonToggleUnknownCustomMessages[key]));
    }

    return messages;
  }

  get options(): ButtonToggleUnknownCustomOptions {
    return {
      ...(this.builder.prop.handler.options || {})
    } as ButtonToggleUnknownCustomOptions;
  }

}

JsfRegister.handler('common/button-toggle-unknown-custom', ButtonToggleUnknownCustomBuilder, jsfHandlerCommonButtonToggleUnknownCustomCompatibility);
