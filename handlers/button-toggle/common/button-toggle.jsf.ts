import { JsfDefinition, HandlerCompatibilityInterface } from '@kalmia/jsf-common-es2015';
import { JsfProp, JsfPropObject }                       from '@kalmia/jsf-common-es2015/lib/schema';
import { EditorInterfaceLayoutFactory }                 from '../../../../../../../common/src/editor/helpers/editor-factory';
import { BreakpointOrCustomSize }                       from '@kalmia/jsf-app/lib/kal-jsf-doc/services/responsive.service';

const jsfHandlerCommonButtonToggleFormJsfDefinition: JsfDefinition = {
  schema: {
    type: 'object',
    properties: {
      values: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: {
              type: 'number',
              title: 'Value'
            },
            label: {
              type: 'string',
              title: 'Label'
            },
            icon: {
              type: 'string',
              title: 'Icon'
            }
          }
        }
      },
      enabledItemsRadioLike: {
        type: 'boolean',
        title: 'Enabled items radio like'
      }
    }
  },
  layout: {
    type: 'div',
    items: [
      {
        type: 'heading',
        level: 5,
        title: 'Items'
      },
      {
        type: 'div',
        htmlClass: 'ml-3',
        items: [
          {
            type: 'array',
            key: 'values',
            items: [
              {
                type: 'row',
                items: [
                  {
                    type: 'col',
                    xs: 'auto',
                    items: [
                      {
                        key: 'values[].label'
                      }
                    ]
                  },
                  {
                    type: 'col',
                    xs: 'auto',
                    items: [
                      {
                        key: 'values[].value'
                      }
                    ]
                  },
                  {
                    type: 'col',
                    xs: 'auto',
                    items: [
                      {
                        key: 'values[].icon'
                      }
                    ]
                  },
                  {
                    type: 'col',
                    xs: 'content',
                    items: [
                      {
                        type: 'array-item-remove',
                        icon: 'delete',
                        preferences: {
                          variant: 'icon'
                        },
                        tooltip: 'Remove button-toggle item'
                      }
                    ]
                  },
                  {
                    type: 'col',
                    xs: 12,
                    items: [
                      {
                        type: 'hr'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: 'array-item-add',
            path: 'values',
            title: 'Add button-toggle item'
          }
        ]
      },
      {
        type: 'heading',
        level: 5,
        title: 'Preferences',
        htmlClass: 'mt-3'
      },
      {
        key: 'enabledItemsRadioLike',
        htmlClass: 'ml-3'
      }
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
            type : 'string',
            handler: {
              type: 'common/dropdown',
              values: [
                { label: 'Basic', value: 'basic' },
                { label: 'Tiles', value: 'tile' },
                { label: 'Large tiles', value: 'tile-large' },
              ]
            },
            default: 'basic',
          },

          displayModeBreakpoint    : {
            type : 'string',
              handler: {
              type: 'common/dropdown',
                values: [
                { label: 'XS', value: 'xs' },
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
                { label: 'XL', value: 'xl' },
              ]
            }
          },

          showSelectedCheckMark: {
            type: 'boolean',
            title: 'Show selected check mark'
          },

          scaleModeTilesPerRow: {
            type: 'integer',
            minimum: 1,
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
          ...EditorInterfaceLayoutFactory.outputKey('handlerPreferences.scaleModeTilesPerRow', 'Tiles per row in scale mode'),
        ])
      ])
    ]
  }
};

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  x.schema.properties.values.items.properties.value.type = prop.type;
  return x;
};

export const jsfHandlerCommonButtonToggleCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonButtonToggleFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonButtonToggleLayoutJsfDefinition,
  title: 'Button Toggle',
  icon: 'handler-icons/button-toggle.svg',
  category: 'Common',

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
  ]
};
