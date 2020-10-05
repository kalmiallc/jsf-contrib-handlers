import { EditorInterfaceLayoutFactory, HandlerCompatibilityInterface, JsfDefinition, wrapKeyDynamic } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                                                                    from '@kalmia/jsf-common-es2015/lib/schema';
import { RadioMessages }                                                                              from './messages';

const jsfHandlerCommonRadioFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      values     : {
        type : 'array',
        items: {
          type      : 'object',
          properties: {
            value  : {
              type : 'number',
            },
            label  : {
              type : 'string',
            },
            tooltip: {
              type : 'string',
            }
          }
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.outputArrayCardListKey('values',
        { $eval: `return { value: 'Value' }`, dependencies: [] },
        [
          {
            type: 'row',
            items: [
              {
                type: 'col',
                xs: 6,
                items: [
                  ...EditorInterfaceLayoutFactory.outputKey('values[].label', 'Label'),
                ]
              },
              {
                type: 'col',
                xs: 6,
                items: [
                  ...EditorInterfaceLayoutFactory.outputKey('values[].value', 'Value')
                ]
              }
            ]
          },
          ...EditorInterfaceLayoutFactory.outputKey('values[].tooltip', 'Tooltip')
        ])
    ]
  }
} as any;

export const jsfHandlerCommonRadioLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {
      handlerPreferences: {
        type      : 'object',
        properties: {
          layout: {
            type   : 'string',
            handler: {
              type  : 'common/dropdown',
              values: [
                { label: 'Block', value: 'block' },
                { label: 'Inline', value: 'inline' },
                { label: 'Flex', value: 'flex' }
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
        ...EditorInterfaceLayoutFactory.createPanel('Radio', [
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.layout', 'Layout type')
        ])
      ])
    ]
  }
};

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  x.schema.properties.values.items.properties.value.type = prop.type;
  return x;
};

export const jsfHandlerCommonRadioCompatibility: HandlerCompatibilityInterface = {

  formDefinition  : jsfHandlerCommonRadioFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonRadioLayoutJsfDefinition,
  title           : 'Radio',
  icon            : 'handler-icons/radio.svg',
  category        : 'Common',

  compatibleWith: [
    {
      type: 'string',
      formDefinitionTransform
    }, {
      type: 'number',
      formDefinitionTransform // <- optional
    }, {
      type: 'integer',
      formDefinitionTransform // <- optional can also be direct: (x, p) => { return x }
    }
  ],

  localization: {
    translatableProperties: [() => Object.values(RadioMessages), (definition) => {
      return Array.isArray(definition?.handler?.values) ? definition.handler.values.map(x => typeof x === 'object' ? x.label : x) : [];
    }]
  }
};
