import { HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                      from '@kalmia/jsf-common-es2015/lib/schema';
import { EditorInterfaceLayoutFactory }                 from '../../../../../../../common/src/editor/helpers/editor-factory';

const jsfHandlerCommonCodeEditorFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      language: {
        type   : 'string',
        title  : 'Language',
        handler: {
          type  : 'common/dropdown',
          values: [
            { label: 'javascript', value: 'javascript' },
            { label: 'typescript', value: 'typescript' },
            { label: 'json', value: 'json' },
            { label: 'css', value: 'css' },
            { label: 'scss', value: 'scss' }
          ]
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      {
        type : 'heading',
        level: 5,
        title: 'Language'
      },
      {
        type     : 'div',
        htmlClass: 'ml-3',
        items    : [
          {
            key: 'language'
          }
        ]
      }
    ]
  }
} as any;

export const jsfHandlerCommonCodeEditorLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {}
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Code editor', [
          ...EditorInterfaceLayoutFactory.createLabel('No configuration available.')
        ])
      ])
    ]
  }
};

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  // x.schema.properties.values.items.properties.value.type = prop.type
  return x;
};

export const jsfHandlerCommonCodeEditorCompatibility: HandlerCompatibilityInterface = {

  formDefinition  : jsfHandlerCommonCodeEditorFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonCodeEditorLayoutJsfDefinition,
  title           : 'Code editor',
  icon            : 'handler-icons/code-editor.svg',
  category        : 'Common',

  compatibleWith: [
    {
      type: 'string'
    }
  ]
};
