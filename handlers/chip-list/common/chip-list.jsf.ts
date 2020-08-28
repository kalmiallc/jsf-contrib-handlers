import { HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                      from '@kalmia/jsf-common-es2015/lib/schema';

const jsfHandlerCommonChipListJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {}
  },
  layout: {
    type : 'div',
    items: []
  }
} as any;

const formDefinitionTransform = (x: any, prop: JsfProp) => {
  x.schema.properties.values.items.properties.value.type = prop.type;
  return x;
};

export const jsfHandlerChipListDropdownCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonChipListJsfDefinition,
  title         : 'Chip list',
  category      : 'Common',

  compatibleWith: [
    {
      type: 'array',
      formDefinitionTransform
    }
  ]
};
