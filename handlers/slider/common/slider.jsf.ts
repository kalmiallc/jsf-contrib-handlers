import { JsfDefinition, HandlerCompatibilityInterface } from '@kalmia/jsf-common-es2015';
import { JsfProp, JsfPropObject }                       from '@kalmia/jsf-common-es2015/lib/schema';

const jsfHandlerCommonSliderJsfDefinition: JsfDefinition = {
  schema: {
    type: 'object',
    properties: {
      orientation: {
        type: 'string',
        handler: {
          type: 'common/button-toggle',
          values: [
            { label: 'Horizontal', value: 'horizontal'},
            { label: 'Vertical', value: 'vertical'}
          ]
        }
      },
      thumbLabel: {
        type: 'boolean',
        title: 'Thumb label'
      },
      thickInterval: {
        type: 'object',
        properties: {
          whichType: {
            type: 'string',
            handler: {
              type: 'common/button-toggle',
              values: [
                { label: 'Boolean', value: 'boolean' },
                { label: 'Number', value: 'number' },
                { label: 'Auto', value: 'auto' }
              ]
            }
          },
          boolean: {
            type: 'boolean',
            title: 'Thick interval',
            enabledIf: {
              $eval: `return $val.thickInterval.whichType === 'boolean'`,
              dependencies: ['thickInterval.whichType']
            }
          },
          number: {
            type: 'number',
            title: 'Thick interval',
            enabledIf: {
              $eval: `return $val.thickInterval.whichType === 'number'`,
              dependencies: ['thickInterval.whichType']
            }
          }
        }
      },
      invert: {
        type: 'boolean',
        title: 'Invert'
      }
    }
  },
  layout: {
    type: 'div',
    items: [
      {
        type: 'heading',
        level: 5,
        title: 'Preferences'
      },
      {
        type: 'div',
        htmlClass: 'ml-3',
        items: [
          {
            type: 'span',
            title: 'Orientation'
          },
          {
            key: 'orientation',
            htmlClass: 'mb-3'
          },
          {
            key: 'thumbLabel',
            htmlClass: 'mb-3'
          },
          {
            type: 'span',
            title: 'Thick Interval'
          },
          {
            key: 'thickInterval.whichType'
          },
          {
            key: 'thickInterval.boolean',
            visibleIf: {
              $eval: `return $val.thickInterval.whichType === 'boolean'`,
              dependencies: ['thickInterval.whichType']
            }
          },
          {
            key: 'thickInterval.number',
            visibleIf: {
              $eval: `return $val.thickInterval.whichType === 'number'`,
              dependencies: ['thickInterval.whichType']
            }
          },
          {
            key: 'invert',
            htmlClass: 'mt-3'
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

export const jsfHandlerCommonSliderCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonSliderJsfDefinition,
  title: 'Slider',
  icon: 'handler-icons/slider.svg',
  category: 'Common',

  compatibleWith: [
    {
      type: 'number',
      formDefinitionTransform
    },
    {
      type: 'integer',
      formDefinitionTransform
    }
  ]
};
