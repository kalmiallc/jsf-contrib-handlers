import {
  isI18nObject,
  JsfBasicHandlerBuilder,
  JsfPropBuilderInteger,
  JsfPropBuilderNumber,
  JsfRegister,
  JsfTranslatableMessage
}                         from '@kalmia/jsf-common-es2015';
import { SliderMessages } from './messages';
import { isNil }          from 'lodash';
import { jsfHandlerCommonSliderCompatibility } from './slider.jsf';


export class HandlerSliderBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderNumber | JsfPropBuilderInteger> {

  type = 'common/slider';


  get min() {
    let handlerMin = (this.builder.prop.handler as any).minimum;

    if (isNil(handlerMin)) {
      handlerMin = this.builder.prop.minimum;
    }

    if (isNil(handlerMin)) {
      throw new Error('No minimum value set for slider handler.');
    }

    return handlerMin;
  }

  get max() {
    let handlerMax = (this.builder.prop.handler as any).maximum;

    if (isNil(handlerMax)) {
      handlerMax = this.builder.prop.maximum;
    }

    if (isNil(handlerMax)) {
      throw new Error('No maximum value set for slider handler.');
    }

    return handlerMax;
  }

  get step() {
    let handlerStep = (this.builder.prop.handler as any).step;

    if (isNil(handlerStep)) {
      handlerStep = null;
    }

    return handlerStep;
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

    for (const key of Object.keys(SliderMessages)) {
      messages.push(new JsfTranslatableMessage(SliderMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler('common/slider', HandlerSliderBuilder, jsfHandlerCommonSliderCompatibility);
