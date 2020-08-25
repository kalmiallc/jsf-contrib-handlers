import { HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                      from '@kalmia/jsf-common-es2015/lib/schema';

const jsfHandlerCommonCodeEditorJsfDefinition: JsfDefinition = {
  schema: {
    type: 'object',
    properties: {
      language: {
        type: 'string',
        title: 'Language',
        handler: {
          type: 'common/dropdown',
          values: [
            { label: 'javascript', value: 'javascript'},
            { label: 'typescript', value: 'typescript'},
            { label: 'json', value: 'json'},
            { label: 'css', value: 'css'},
            { label: 'scss', value: 'scss'},
          ]
        }
      },
    }
  },
  layout: {
    type: 'div',
    items: [
      {
        type: 'heading',
        level: 5,
        title: 'Language'
      },
      {
        type: 'div',
        htmlClass: 'ml-3',
        items: [
          {
            key: 'language'
          }
        ]
      }
    ]
  }
} as any;

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  // x.schema.properties.values.items.properties.value.type = prop.type
  return x;
};

export const jsfHandlerCommonCodeEditorCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonCodeEditorJsfDefinition,
  title: 'Code editor',
  icon: 'handler-icons/code-editor.svg',
  category: 'Common',

  compatibleWith: [
    {
      type: 'string'
    }
  ]
};
