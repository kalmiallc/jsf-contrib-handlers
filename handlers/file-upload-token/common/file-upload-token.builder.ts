import { JsfBasicHandlerBuilder, JsfPropBuilderString, JsfRegister, JsfTranslatableMessage } from '@kalmia/jsf-common-es2015';
import { FileUploadTokenMessages }                                                           from './messages';
import { jsfHandlerCommonFileUploadTokenCompatibility } from './file-upload-token.jsf';


export type FileUploadTokenFormat = 's3' | 'base64';

export class HandlerFileUploadTokenBuilder extends JsfBasicHandlerBuilder<JsfPropBuilderString> {

  type = 'common/file-upload-token';

  public token: string;
  public presignedFileUploadUrl: string;
  public presignedFileDownloadUrl: string;

  private _allowedExtensions: string[];
  private _allowedExtensionsString: string;

  private _format: FileUploadTokenFormat;

  constructor(builder: JsfPropBuilderString) {
    super(builder);

    this._format = (this.builder.prop.handler as any).format || 's3';

    this._allowedExtensions       = (this.builder.prop.handler as any).allowedExtensions || null;
    this._allowedExtensionsString = this._allowedExtensions && this._allowedExtensions.map(x => `.${ x }`).join(',');
  }

  get format(): FileUploadTokenFormat {
    return this._format;
  }

  get allowedExtensions(): string[] {
    return this._allowedExtensions;
  }

  get allowedExtensionsString(): string {
    return this._allowedExtensionsString;
  }

  /**
   * Translations
   */
  getStaticTranslatableStrings(): JsfTranslatableMessage[] {
    const messages: JsfTranslatableMessage[] = [];

    for (const key of Object.keys(FileUploadTokenMessages)) {
      messages.push(new JsfTranslatableMessage(FileUploadTokenMessages[key]));
    }

    return messages;
  }
}

JsfRegister.handler('common/file-upload-token', HandlerFileUploadTokenBuilder, jsfHandlerCommonFileUploadTokenCompatibility);
