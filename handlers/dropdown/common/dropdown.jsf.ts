import { EditorInterfaceLayoutFactory, HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                                                    from '@kalmia/jsf-common-es2015/lib/schema';
import { DropdownMessages }                                                           from './messages';

const jsfHandlerCommonDropdownFormJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      stepperButtons: {
        type : 'boolean',
        title: 'Stepper buttons'
      },
      searchable    : {
        type : 'boolean',
        title: 'Searchable'
      },
      values        : {
        type : 'array',
        items: {
          type      : 'object',
          properties: {
            value: {
              type : 'number',
              title: 'Value'
            },
            label: {
              type : 'string',
              title: 'Label'
            }
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
            type     : 'div',
            htmlClass: 'mt-3',
            items    : [
              {
                type : 'array',
                key  : 'values',
                items: [
                  {
                    type : 'row',
                    items: [
                      {
                        type : 'col',
                        xs   : 'auto',
                        items: [
                          {
                            type : 'row',
                            items: [
                              {
                                type : 'col',
                                xs   : 6,
                                items: [
                                  {
                                    key: 'values[].label'
                                  }
                                ]
                              },
                              {
                                type : 'col',
                                xs   : 6,
                                items: [
                                  {
                                    key: 'values[].value'
                                  }
                                ]
                              }
                            ]
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
                            tooltip    : 'Remove dropdown item'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type : 'array-item-add',
                path : 'values',
                title: 'Add dropdown item'
              }
            ]
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
            key      : 'stepperButtons',
            htmlClass: 'mb-3'
          },
          {
            key      : 'searchable',
            htmlClass: 'mb-3'
          }
        ]
      }
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


const formDefinitionTransform = (x: any, prop: JsfProp) => {
  x.schema.properties.values.items.properties.value.type = prop.type;
  return x;
};

export const jsfHandlerCommonDropdownCompatibility: HandlerCompatibilityInterface = {

  formDefinition  : jsfHandlerCommonDropdownFormJsfDefinition,
  layoutDefinition: jsfHandlerCommonDropdownLayoutJsfDefinition,
  title           : 'Dropdown',
  icon            : 'handler-icons/dropdown.svg',
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
    translatableProperties: [() => Object.values(DropdownMessages)]
  }
};
