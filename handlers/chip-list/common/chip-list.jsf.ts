import { HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                      from '@kalmia/jsf-common-es2015/lib/schema';
import { EditorInterfaceLayoutFactory }                 from '../../../../../../../common/src/editor/helpers/editor-factory';

const jsfHandlerCommonChipListFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {}
  },
  layout: {
    type : 'div',
    items: []
  }
} as any;

export const jsfHandlerCommonChipListLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {
      handlerPreferences: {
        type      : 'object',
        properties: {
          selectable: {
            type: 'boolean',
            title: 'Selectable',
            default: true
          },

          removable: {
            type: 'boolean',
            title: 'Removable',
            default: true
          },

          addOnBlur: {
            type: 'boolean',
            title: 'Add on blur',
            default: true
          },
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Chip list', [
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.selectable'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.removable'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.addOnBlur'),
        ])
      ])
    ]
  }
};

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  x.schema.properties.values.items.properties.value.type = prop.type;
  return x;
};

export const jsfHandlerChipListDropdownCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonChipListFormJsfDefinition,
  title         : 'Chip list',
  category      : 'Common',

  compatibleWith: [
    {
      type: 'array',
      formDefinitionTransform
    }
  ]
};
