import {
  EditorInterfaceLayoutFactory,
  EditorInterfaceSchemaFactory,
  HandlerCompatibilityInterface,
  JsfDefinition,
  wrapKeyDynamic
} from '@kalmia/jsf-common-es2015';

const jsfHandlerCommonButtonToggleFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
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
                },
                icon : {
                  type: 'string'
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
            type      : 'object',
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
        ...EditorInterfaceLayoutFactory.createPanel('Button toggle', [
          ...EditorInterfaceLayoutFactory.outputDynamicSwitchablePropKey('', 'values', 'Values', [
            {
              typeKey         : 'static',
              layoutDefinition: {
                type : 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputArrayCardListKey(wrapKeyDynamic('static'),
                    { $eval: `return { value: 'Value' }`, dependencies: [] },
                    [
                      {
                        type : 'row',
                        items: [
                          {
                            type : 'col',
                            xs   : 6,
                            items: [
                              ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].label'), 'Label')
                            ]
                          },
                          {
                            type : 'col',
                            xs   : 6,
                            items: [
                              ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].value'), 'Value')
                            ]
                          }
                        ],
                      },
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].icon'), 'Icon')
                    ]
                  )
                ]
              }
            },
            {
              typeKey         : 'eval',
              layoutDefinition: {
                type : 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputKeyWithCodeEditor(wrapKeyDynamic('eval.$eval'), 'Eval'),
                  ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('eval.dependencies'), 'Dependencies')
                ]
              }
            },
            {
              typeKey         : 'provider',
              layoutDefinition: {
                type : 'div',
                items: [
                  ...EditorInterfaceLayoutFactory.outputJsfProviderExecutorProperty('', wrapKeyDynamic('provider.provider'))
                ]
              }
            }
          ])
        ])
      ])
    ]
  }
} as any;


export const jsfHandlerCommonButtonToggleLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {
      handlerPreferences: {
        type      : 'object',
        properties: {
          variant: {
            type   : 'string',
            handler: {
              type  : 'common/dropdown',
              values: [
                { label: 'Basic', value: 'basic' },
                { label: 'Tiles', value: 'tile' },
                { label: 'Large tiles', value: 'tile-large' }
              ]
            },
            default: 'basic'
          },

          displayModeBreakpoint: {
            type   : 'string',
            handler: {
              type  : 'common/dropdown',
              values: [
                { label: 'XS', value: 'xs' },
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
                { label: 'XL', value: 'xl' }
              ]
            }
          },

          showSelectedCheckMark: {
            type : 'boolean',
            title: 'Show selected check mark'
          },

          scaleModeTilesPerRow: {
            type   : 'integer',
            minimum: 1
          }
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Button toggle', [
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.variant', 'Variant'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.displayModeBreakpoint', 'Display mode breakpoint'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.showSelectedCheckMark'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.scaleModeTilesPerRow', 'Tiles per row in scale mode')
        ])
      ])
    ]
  }
};


export const jsfHandlerCommonButtonToggleCompatibility: HandlerCompatibilityInterface = {

  formDefinition  : jsfHandlerCommonButtonToggleFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonButtonToggleLayoutJsfDefinition,
  title           : 'Button toggle',
  icon            : 'handler-icons/button-toggle.svg',
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
    translatableProperties: [(definition) => {
      return Array.isArray(definition?.handler?.values) ? definition.handler.values.map(x => typeof x === 'object' ? x.label : x) : [];
    }]
  }
};
