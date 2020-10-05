import { EditorInterfaceLayoutFactory, HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                                                    from '@kalmia/jsf-common-es2015/lib/schema';
import { CodeEditorMessages }                                                         from './messages';

const jsfHandlerCommonCodeEditorFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      options: {
        type: 'object',
        properties: {
          language: {
            type   : 'string',
            title  : 'Language',
            handler: {
              type  : 'common/dropdown',
              values: [
                { label: 'Javascript', value: 'javascript' },
                { label: 'Typescript', value: 'typescript' },
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'SCSS', value: 'scss' },
                { label: 'JSON', value: 'json' },
              ]
            }
          }
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Code editor', [
          ...EditorInterfaceLayoutFactory.outputKey('options.language', 'Language')
        ])
      ])
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
  ],

  localization: {
    translatableProperties: [() => Object.values(CodeEditorMessages)]
  }
};
