import { isI18nObject, JsfBasicHandlerBuilder, JsfPropBuilderString, JsfRegister, JsfTranslatableMessage } from '@kalmia/jsf-common-es2015';
import { CodeEditorMessages }                                                                              from './messages';
import { jsfHandlerCommonCodeEditorCompatibility } from './code-editor.jsf';

export const codeEditorMode = {
  'javascript': {
    name: 'javascript'
  },
  'typescript': {
    name: 'javascript',
    typescript: true
  },
  'json': {
    name: 'javascript',
    json: true
  },
};

export class HandlerCodeEditorBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderString> {

  type = 'common/code-editor';


  get mode() {
    const language = this.builder.prop.handler.options.language;
    if (!language || !codeEditorMode[language]) {
      throw new Error(`Unknown language "${ language }" (supported languages: ${ Object.keys(codeEditorMode).join(', ') })`);
    }
    return codeEditorMode[language];
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

    for (const key of Object.keys(CodeEditorMessages)) {
      messages.push(new JsfTranslatableMessage(CodeEditorMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler('common/code-editor', HandlerCodeEditorBuilder, jsfHandlerCommonCodeEditorCompatibility);
