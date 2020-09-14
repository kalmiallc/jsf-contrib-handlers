import { HandlerCompatibilityInterface, JsfDefinition, EditorInterfaceLayoutFactory } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                      from '@kalmia/jsf-common-es2015/lib/schema';

const jsfHandlerCommonColorPickerFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      colorPickerItems      : {
        type : 'array',
        items: {
          type      : 'object',
          properties: {
            value           : {
              type : 'string',
              title: 'Value'
            },
            label           : {
              type : 'string',
              title: 'Label'
            },
            color           : {
              type : 'string',
              title: 'Color'
            },
            icon            : {
              type : 'string',
              title: 'Icon'
            },
            smallIcon       : {
              type : 'string',
              title: 'Small icon'
            },
            smallIcon2      : {
              type : 'string',
              title: 'Small Icon 2'
            },
            zoomIcon        : {
              type      : 'object',
              properties: {
                icon   : {
                  type : 'string',
                  title: 'Icon'
                },
                tooltip: {
                  type : 'string',
                  title: 'Tooltip'
                },
                // TODO
                onClick: {
                  type: 'string'
                }
              }
            },
            lightness       : {
              type   : 'string',
              title  : 'Lightness',
              handler: {
                type  : 'common/dropdown',
                values: [
                  { label: 'light', value: 'light' },
                  { label: 'superlight', value: 'superlight' },
                  { label: 'dark', value: 'dark' }
                ]
              }
            },
            advancedSettings: {
              type   : 'boolean',
              title  : 'Advanced settings',
              default: false
            }
          }
        }
      },
      colorPickerOptions    : {
        type      : 'object',
        properties: {
          mode: {
            type   : 'string',
            title  : 'Mode',
            handler: {
              type  : 'common/button-toggle',
              values: [
                { label: 'Ral', value: 'ral' },
                { label: 'Custom', value: 'custom' }
              ]
            }
          }
        }
      },
      colorPickerPreferences: {
        type      : 'object',
        properties: {
          variant        : {
            type   : 'string',
            title  : 'Variant',
            handler: {
              type  : 'common/dropdown',
              values: [
                { label: 'tile', value: 'tile' },
                { label: 'popover-menu', value: 'popover-menu' }
              ]
            }
          },
          height         : {
            type       : 'string',
            title      : 'Maximum height',
            description: 'Should the tiles exceed this value the container will become scrollable.'
          },
          tileSize       : {
            type       : 'number',
            title      : 'Tile size',
            description: 'Minimum allowed tile size.'
          },
          tileHeightRatio: {
            type       : 'number',
            title      : 'Tile height ratio',
            description: 'Percentage value of width the tiles height should occupy.'
          },
          tilePadding    : {
            type       : 'string',
            title      : 'Tile padding',
            description: 'Padding between tiles.',
            placeholder: '2px'
          },
          tilesPerRow    : {
            type       : 'number',
            title      : 'Tiles per row',
            description: 'Desired amount of tiles per row.'
          },
          searchable     : {
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
      {
        type : 'heading',
        level: 5,
        title: 'Items'
      },
      {
        type     : 'div',
        htmlClass: 'ml-3',
        items    : [
          {
            type : 'expansion-panel',
            key  : 'colorPickerItems',
            items: [
              {
                type : 'expansion-panel-header',
                items: [
                  {
                    type           : 'row',
                    horizontalAlign: 'between',
                    verticalAlign  : 'center',
                    htmlClass      : '',
                    items          : [
                      {
                        type : 'col',
                        xs   : 'auto',
                        items: [
                          {
                            type        : 'span',
                            title       : '{{value}}',
                            templateData: {
                              $eval       : ` return {value: $getItemValue('colorPickerItems[]').label };`,
                              dependencies: ['colorPickerItems[].label']
                            }
                          }
                        ]
                      },
                      {
                        type : 'col',
                        xs   : 'content',
                        items: [
                          {
                            type       : 'array-item-remove',
                            icon       : 'delete',
                            preferences: {
                              variant: 'icon'
                            },
                            tooltip    : 'Remove item'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type : 'expansion-panel-content',
                items: [
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 6,
                        items: [
                          {
                            key: 'colorPickerItems[].label'
                          }
                        ]
                      },
                      {
                        type : 'col',
                        xs   : 6,
                        items: [
                          {
                            key: 'colorPickerItems[].value'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 12,
                        items: [
                          {
                            key: 'colorPickerItems[].color'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 12,
                        items: [
                          {
                            key: 'colorPickerItems[].icon'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 12,
                        items: [
                          {
                            key: 'colorPickerItems[].advancedSettings'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type     : 'div',
                    visibleIf: {
                      $eval       : `return $getItemValue('colorPickerItems[].advancedSettings')`,
                      dependencies: ['colorPickerItems[].advancedSettings']
                    },
                    items    : [
                      {
                        type : 'row',
                        items: [
                          {
                            type : 'col',
                            xs   : 12,
                            items: [
                              {
                                key: 'colorPickerItems[].lightness'
                              }
                            ]
                          }
                        ]
                      },
                      {
                        type : 'row',
                        items: [
                          {
                            type : 'col',
                            xs   : 6,
                            items: [
                              {
                                key: 'colorPickerItems[].smallIcon'
                              }
                            ]
                          },
                          {
                            type : 'col',
                            xs   : 6,
                            items: [
                              {
                                key: 'colorPickerItems[].smallIcon2'
                              }
                            ]
                          }
                        ]
                      },
                      {
                        type     : 'row',
                        htmlClass: '',
                        items    : [
                          {
                            type : 'col',
                            xs   : 12,
                            items: [
                              {
                                type : 'heading',
                                title: 'Zoom icon',
                                level: 6
                              }
                            ]
                          },
                          {
                            type     : 'col',
                            htmlClass: 'ml-3',
                            xs       : 6,
                            items    : [
                              {
                                key: 'colorPickerItems[].zoomIcon.icon'
                              }
                            ]
                          },
                          {
                            type     : 'col',
                            htmlClass: 'ml-3',
                            xs       : 6,
                            items    : [
                              {
                                key: 'colorPickerItems[].zoomIcon.tooltip'
                              }
                            ]
                          },
                          {
                            type     : 'col',
                            htmlClass: 'ml-3',
                            xs       : 12,
                            items    : [
                              // TODO
                              // createOnClickJsfLayout('colorPickerItems[].zoomIcon.onClick')
                            ]
                          }

                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type       : 'array-item-add',
            path       : 'colorPickerItems',
            icon       : 'add',
            title      : 'Add item',
            preferences: {
              variant: 'flat',
              size   : 'small'
            }
          }
        ]
      },
      {
        type     : 'heading',
        level    : 5,
        title    : 'Options',
        htmlClass: 'mt-3'
      },
      {
        type     : 'div',
        htmlClass: 'ml-3',
        items    : [
          {
            key: 'colorPickerOptions.mode'
          }
        ]
      },
      {
        type     : 'heading',
        level    : 5,
        title    : 'Preferences',
        htmlClass: 'mt-3'
      },
      {
        type     : 'div',
        htmlClass: 'ml-3',
        items    : [
          {
            key: 'colorPickerPreferences.variant'
          },
          {
            key: 'colorPickerPreferences.tilesPerRow'
          },
          {
            key: 'colorPickerPreferences.tileSize'
          },
          {
            key: 'colorPickerPreferences.tileHeightRatio'
          },
          {
            key        : 'colorPickerPreferences.tilePadding',
            placeholder: '2px'
          },
          {
            key: 'colorPickerPreferences.height'
          },
          {
            key      : 'colorPickerPreferences.searchable',
            htmlClass: 'mt-1 font-weight-normal'
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

export const jsfHandlerCommonColorPickerLayoutJsfDefinition: any = {
  schema: {
    type      : 'object',
    properties: {
      handlerPreferences: {
        type: 'object',
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
  ]
};
