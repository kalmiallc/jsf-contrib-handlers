import {
  EditorInterfaceLayoutFactory,
  EditorInterfaceSchemaFactory,
  HandlerCompatibilityInterface,
  JsfDefinition,
  wrapKeyDynamic
}                         from '@kalmia/jsf-common-es2015';
import { JsfProp }        from '@kalmia/jsf-common-es2015/lib/schema';
import { SliderMessages } from './messages';

const jsfHandlerCommonSliderFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Slider', [
          ...EditorInterfaceLayoutFactory.createLabel('No configuration available.')
        ])
      ])
    ]
  }
} as any;

export const jsfHandlerCommonSliderLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {
      handlerPreferences: {
        type      : 'object',
        properties: {
          orientation: {
            type   : 'string',
            handler: {
              type  : 'common/dropdown',
              values: [
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' }
              ]
            }
          },

          thumbLabel: {
            type : 'boolean',
            title: 'Show thumb label'
          },

          ...EditorInterfaceSchemaFactory.createDynamicSwitchableProperty('handlerPreferences', 'tickInterval', [
            {
              typeKey       : 'basic',
              typeName      : 'Basic',
              propDefinition: {
                type   : 'boolean',
                title  : 'Enabled',
                default: true
              }
            },
            {
              typeKey       : 'auto',
              typeName      : 'Auto',
              propDefinition: {
                type : 'string',
                const: 'auto'
              }
            },
            {
              typeKey       : 'custom',
              typeName      : 'Custom',
              propDefinition: {
                type   : 'integer',
                minimum: 0
              }
            }
          ]),

          invert: {
            type : 'boolean',
            title: 'Invert'
          }
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Slider', [
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.orientation', 'Orientation'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.thumbLabel'),
          ...EditorInterfaceLayoutFactory.outputDynamicSwitchablePropKey('handlerPreferences', 'tickInterval', 'Tick interval', [
            {
              typeKey         : 'basic',
              layoutDefinition: {
                type : 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('basic'))
                ]
              }
            },
            {
              typeKey         : 'auto',
              layoutDefinition: {
                type : 'div',
                items: []
              }
            },
            {
              typeKey         : 'custom',
              layoutDefinition: {
                type : 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('custom'), 'Interval')
                ]
              }
            }
          ]),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.invert')
        ])
      ])
    ]
  }
};

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  // x.schema.properties.values.items.properties.value.type = prop.type
  return x;
};

export const jsfHandlerCommonSliderCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonSliderFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonSliderLayoutJsfDefinition,
  title         : 'Slider',
  icon          : 'handler-icons/slider.svg',
  category      : 'Common',

  compatibleWith: [
    {
      type: 'number',
      formDefinitionTransform
    },
    {
      type: 'integer',
      formDefinitionTransform
    }
  ],

  localization: {
    translatableProperties: [() => Object.values(SliderMessages)]
  }
};
