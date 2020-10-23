import {
  EditorInterfaceLayoutFactory,
  EditorInterfaceSchemaFactory,
  HandlerCompatibilityInterface,
  JsfDefinition, wrapKeyDynamic
} from '@kalmia/jsf-common-es2015';
import { JsfProp }                                                                    from '@kalmia/jsf-common-es2015/lib/schema';
import { ColorPickerMessages }                                                        from './messages';

const jsfHandlerCommonColorPickerFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      options    : {
        type      : 'object',
        properties: {
          mode: {
            type   : 'string',
            handler: {
              type  : 'common/button-toggle',
              values: [
                { label: 'RAL', value: 'ral' },
                { label: 'Custom', value: 'custom' }
              ]
            }
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
                },
                color           : {
                  type : 'string',
                },
                icon            : {
                  type : 'string',
                },
                smallIcon       : {
                  type : 'string',
                },
                smallIcon2      : {
                  type : 'string',
                },
                zoomIcon        : {
                  type      : 'object',
                  properties: {
                    icon   : {
                      type : 'string',
                    },
                    tooltip: {
                      type : 'string',
                    },
                    /*
                    onClick: EditorInterfaceSchemaFactory.createOnClickProperty('', wrapKeyDynamic('static.zoomIcon.onClick'))[wrapKeyDynamic('static.zoomIcon.onClick')]
                   */
                  }
                },
                lightness       : {
                  type   : 'string',
                  handler: {
                    type  : 'common/dropdown',
                    values: [
                      { label: 'Light', value: 'light' },
                      { label: 'Superlight', value: 'superlight' },
                      { label: 'Dark', value: 'dark' }
                    ]
                  }
                },
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
              provider: EditorInterfaceSchemaFactory.createJsfProviderExecutorProperty('', wrapKeyDynamic('provider'))[wrapKeyDynamic('provider')]
            }
          }
        }
      ]),
    }
  },
  layout: {
    type : 'div',
    items: [
      ...EditorInterfaceLayoutFactory.createPanelGroup([
        ...EditorInterfaceLayoutFactory.createPanel('Color picker', [
          ...EditorInterfaceLayoutFactory.outputKey('options.mode', 'Mode'),
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
                      },
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].color'), 'Color'),
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].icon'), 'Icon'),
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].smallIcon'), 'Small icon'),
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].smallIcon2'), 'Small icon 2'),
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].zoomIcon.icon'), 'Zoom icon'),
                      ...EditorInterfaceLayoutFactory.outputKey(wrapKeyDynamic('static[].zoomIcon.tooltip'), 'Zoom icon tooltip'),
                      /*
                      ...EditorInterfaceLayoutFactory.createLabel('Zoom icon click'),
                      ...EditorInterfaceLayoutFactory.outputOnClickProperty('', wrapKeyDynamic('static[].zoomIcon.onClick'))
                       */
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
        ])
      ])
    ]
  }
} as any;

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  // x.schema.properties.values.items.properties.value.type = prop.type
  return x;
};

export const jsfHandlerCommonColorPickerLayoutJsfDefinition: any = {
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
                { label: 'Tile', value: 'tile' },
                { label: 'Popover menu', value: 'popover-menu' }
              ]
            }
          },

          height: {
            type: 'string'
          },

          tileSize: {
            type: 'number'
          },

          tileHeightRatio: {
            type: 'number'
          },

          tilePadding: {
            type: 'string'
          },

          tilesPerRow: {
            type   : 'integer',
            minimum: 1
          },

          searchable: {
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
        ...EditorInterfaceLayoutFactory.createPanel('Color picker', [
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.variant', 'Variant'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.height', 'Height'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.tileSize', 'Tile size'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.tileHeightRatio', 'Tile height ratio'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.tilePadding', 'Tile padding'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.tilesPerRow', 'Tiles per row'),
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.searchable')
        ])
      ])
    ]
  }
};

export const jsfHandlerCommonColorPickerCompatibility: HandlerCompatibilityInterface = {

  formDefinition  : jsfHandlerCommonColorPickerFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonColorPickerLayoutJsfDefinition,
  title           : 'Color picker',
  icon            : 'handler-icons/color-picker.svg',
  category        : 'Common',

  compatibleWith: [
    {
      type: 'string',
      formDefinitionTransform
    }
  ],

  localization: {
    translatableProperties: [() => Object.values(ColorPickerMessages), (definition) => {
      return Array.isArray(definition?.handler?.values) ? definition.handler.values.map(x => typeof x === 'object' ? x.label : x) : [];
    }]
  }
};
