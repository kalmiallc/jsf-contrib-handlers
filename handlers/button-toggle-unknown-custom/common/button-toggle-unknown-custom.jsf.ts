import { JsfDefinition, HandlerCompatibilityInterface } from '@kalmia/jsf-common-es2015';
import { JsfProp, JsfPropObject }                       from '@kalmia/jsf-common-es2015/lib/schema';

const jsfHandlerCommonButtonToggleUnknownCustomJsfDefinition: JsfDefinition = {
  schema: {
    type: 'object',
    properties: {
      options: {
        type: 'object',
        properties: {
          dependsOn: {
            type: 'string',
            title: 'Depends on'
          }
        }
      },
      preferences: {
        type: 'object',
        properties: {
          variant: {
            type: 'string',
            title: 'Variant'
          },
          displayModeBreakpoint: {
            type: 'object',
            properties: {
              breakpointOrCustom: {
                type: 'string',
                handler: {
                  type: 'common/button-toggle',
                  values: [
                    { label: 'Breakpoints', value: 'breakpoint'},
                    { label: 'Custom', value: 'custom'}
                  ]
                }
              },
              breakpoint: {
                type: 'string',
                handler: {
                  type: 'common/dropdown',
                  values: [
                    { label: 'xs', value: 'xs'},
                    { label: 'sm', value: 'sm'},
                    { label: 'md', value: 'md'},
                    { label: 'lg', value: 'lg'},
                    { label: 'xl', value: 'xl'}
                  ]
                },
                enabledIf: {
                  $eval: `return $val.preferences.displayModeBreakpoint.breakpointOrCustom === 'breakpoint';`,
                  dependencies: ['preferences.displayModeBreakpoint.breakpointOrCustom']
                }
              },
              custom: {
                type: 'integer',
                minimum: 0,
                enabledIf: {
                  $eval: `return $val.preferences.displayModeBreakpoint.breakpointOrCustom === 'custom';`,
                  dependencies: ['preferences.displayModeBreakpoint.breakpointOrCustom']
                }
              }
            }
          },
          showSelectedCheckMark: {
            type: 'boolean',
            title: 'Show selected check mark'
          },
          stepSize: {
            type: 'number',
            title: 'Step size'
          }
        }
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
        htmlClass: 'ml-3 mb-3',
        items: [
          {
            key: 'preferences.variant'
          },
          {
            type: 'span',
            title: 'Display mode breakpoint'
          },
          {
            key: 'preferences.displayModeBreakpoint.breakpointOrCustom'
          },
          {
            key: 'preferences.displayModeBreakpoint.breakpoint',
            visibleIf: {
              $eval: `return $val.preferences.displayModeBreakpoint.breakpointOrCustom === 'breakpoint';`,
              dependencies: ['preferences.displayModeBreakpoint.breakpointOrCustom']
            }
          },
          {
            key: 'preferences.displayModeBreakpoint.custom',
            placeholder: 'px',
            visibleIf: {
              $eval: `return $val.preferences.displayModeBreakpoint.breakpointOrCustom === 'custom';`,
              dependencies: ['preferences.displayModeBreakpoint.breakpointOrCustom']
            }
          },
          {
            key: 'preferences.showSelectedCheckMark',
            htmlClass: 'mb-3 mt-3'
          },
          {
            key: 'preferences.stepSize'
          }
        ]
      },
      {
        type: 'heading',
        level: 5,
        title: 'Options'
      },
      {
        type: 'div',
        htmlClass: 'ml-3 mb-3',
        items: [
          {
            key: 'options.dependsOn'
          }
        ]
      }
    ]
  }
} as any;

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  // x.schema.properties.values.items.properties.value.type = prop.type
  return x;
}

export const jsfHandlerCommonButtonToggleUnknownCustomCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonButtonToggleUnknownCustomJsfDefinition,

  compatibleWith: [
    {
      type: 'string',
      formDefinitionTransform
    }
  ]
}
