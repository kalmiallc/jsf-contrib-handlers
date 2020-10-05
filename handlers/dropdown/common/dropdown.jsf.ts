import {
  EditorInterfaceLayoutFactory,
  EditorInterfaceSchemaFactory,
  HandlerCompatibilityInterface,
  JsfDefinition,
  wrapKeyDynamic
}                           from '@kalmia/jsf-common-es2015';
import { DropdownMessages } from './messages';

const jsfHandlerCommonDropdownFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      options: {
        type      : 'object',
        properties: {
          updatePropOnValuesListChange: {
            type   : 'boolean',
            title  : 'Perform update on values list change',
            default: true
          }
        }
      },

      ...EditorInterfaceSchemaFactory.createDynamicSwitchableProperty('', 'values', [
        {
          typeKey       : 'static',
          typeName      : 'Static',
          propDefinition: {
            type : 'array',
            items: {
              type      : 'object',
              properties: {
                label: {
                  type: 'string'
                },
                value: {
                  type    : '@@PROP_TYPE',
                  required: true
                }
              }
            }
          }
        },
        {
          typeKey       : 'eval',
          typeName      : 'Eval',
          propDefinition: {
            type      : 'object',
            properties: {
              ...EditorInterfaceSchemaFactory.createEvalPropertyWithDependencies()
            }
          }
        },
        {
          typeKey       : 'provider',
          typeName      : 'Provider',
          propDefinition: {
            type: 'object',
            properties: {
              provider: EditorInterfaceSchemaFactory.createJsfProviderExecutorProperty('', wrapKeyDynamic('provider'))[`${ wrapKeyDynamic('provider') }`]
            }
          }
        }
      ])
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Dropdown', [
          ...EditorInterfaceLayoutFactory.outputDynamicSwitchablePropKey('', 'values', 'Values', [
            {
              typeKey         : 'static',
              layoutDefinition: {
                type: 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputArrayCardListKey(wrapKeyDynamic('static'),
                    { $eval: `return { value: 'Value' }`, dependencies: [] },
                    [
                      {
                        type: 'row',
                        items: [
                          {
                            type: 'col',
                            xs: 6,
                            items: [
                              ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].label'), 'Label'),
                            ]
                          },
                          {
                            type: 'col',
                            xs: 6,
                            items: [
                              ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].value'), 'Value')
                            ]
                          }
                        ]
                      }
                    ]
                  )
                ]
              }
            },
            {
              typeKey         : 'eval',
              layoutDefinition: {
                type: 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputKeyWithCodeEditor(wrapKeyDynamic('eval.$eval'), 'Eval'),
                  ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('eval.dependencies'), 'Dependencies')
                ]
              }
            },
            {
              typeKey: 'provider',
              layoutDefinition: {
                type: 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputJsfProviderExecutorProperty('', wrapKeyDynamic('provider.provider'))
                ]
              }
            }
          ]),
          ...EditorInterfaceLayoutFactory.outputKey('options.updatePropOnValuesListChange')
        ])
      ])
    ]
  }
} as any;

export const jsfHandlerCommonDropdownLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {
      handlerPreferences: {
        type      : 'object',
        properties: {
          stepperButtons: {
            type : 'boolean',
            title: 'Stepper buttons'
          },
          searchable    : {
            type : 'boolean',
            title: 'Searchable'
          }
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Dropdown', [
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.searchable'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.stepperButtons')
        ])
      ])
    ]
  }
};


export const jsfHandlerCommonDropdownCompatibility: HandlerCompatibilityInterface = {

  formDefinition  : jsfHandlerCommonDropdownFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonDropdownLayoutJsfDefinition,
  title           : 'Dropdown',
  icon            : 'handler-icons/dropdown.svg',
  category        : 'Common',

  compatibleWith: [
    {
      type: 'string'
    },
    {
      type: 'number'
    },
    {
      type: 'integer'
    },
    {
      type: 'array'
    }
  ],

  localization: {
    translatableProperties: [() => Object.values(DropdownMessages)]
  }
};
