import { JsfDefinition, HandlerCompatibilityInterface } from '@kalmia/jsf-common-es2015';
import { JsfProp, JsfPropObject }                       from '@kalmia/jsf-common-es2015/lib/schema';

const jsfHandlerCommonButtonToggleJsfDefinition: JsfDefinition = {
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

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  x.schema.properties.values.items.properties.value.type = prop.type
  return x;
};

export const jsfHandlerCommonButtonToggleCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonButtonToggleJsfDefinition,
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
