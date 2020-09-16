import { HandlerCompatibilityInterface, JsfDefinition } from '@kalmia/jsf-common-es2015';
import { JsfProp }                                      from '@kalmia/jsf-common-es2015/lib/schema';
import { FileUploadTokenMessages }                      from './messages';

const jsfHandlerCommonFileUploadTokenJsfDefinition: JsfDefinition = {
  schema: {
    type      : 'object',
    properties: {
      height : {
        type : 'string',
        title: 'Height'
      },
      variant: {
        type   : 'string',
        title  : 'Variant',
        handler: {
          type  : 'common/button-toggle',
          values: [
            { label: 'Button', value: 'button' },
            { label: 'Area', value: 'area' }
          ]
        }
      }
    }
  },
  layout: {
    type : 'div',
    items: [
      {
        type     : 'heading',
        level    : 5,
        title    : 'Preferences',
        htmlClass: 'mb-3'
      },
      {
        type     : 'div',
        htmlClass: 'ml-3',
        items    : [
          {
            key      : 'height',
            htmlClass: 'mb-3'
          },
          {
            key      : 'variant',
            htmlClass: 'mb-3'
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

export const jsfHandlerCommonFileUploadTokenCompatibility: HandlerCompatibilityInterface = {

  formDefinition: jsfHandlerCommonFileUploadTokenJsfDefinition,
  title         : 'File upload',
  icon          : 'handler-icons/file-upload-token.svg',
  category      : 'Common',

  compatibleWith: [
    {
      type: 'string',
      formDefinitionTransform
    }
  ],

  localization: {
    translatableProperties: [() => Object.values(FileUploadTokenMessages)]
  }
};
