import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { JsfPropBuilderString, JsfPropLayoutBuilder }                               from '@kalmia/jsf-common-es2015';
import { HandlerFileUploadTokenBuilder }                                            from '../common/file-upload-token.builder';
import { AbstractPropHandlerComponent }                                             from '@kalmia/jsf-app';
import { FileItem, FileUploader, ParsedResponseHeaders }                            from 'ng2-file-upload';

export interface FileUploadTokenPreferences {
  height?: string;
  variant?: 'button' | 'area';
}

@Component({
  selector       : 'app-file-upload-token',
  templateUrl    : './file-upload-token.component.html',
  styleUrls      : ['./file-upload-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:max-line-length
export class FileUploadTokenComponent extends AbstractPropHandlerComponent<JsfPropBuilderString, HandlerFileUploadTokenBuilder> implements OnInit {

  get handlerPreferences(): FileUploadTokenPreferences {
    return {
      /* Defaults */
      height: null,

      /* Layout overrides */
      ...(this.layoutBuilder.layout.handlerPreferences)
    } as FileUploadTokenPreferences;
  }

  get height() {
    return this.handlerPreferences.height;
  }

  get variant() {
    return this.handlerPreferences.variant || 'area';
  }

  get title() {
    return this.propBuilder.prop.title || 'Upload file';
  }

  get allowedExtensions(): string[] {
    return this.handlerBuilder.allowedExtensions;
  }

  get allowedExtensionsString(): string {
    return this.handlerBuilder.allowedExtensionsString;
  }

  @Input()
  layoutBuilder: JsfPropLayoutBuilder<JsfPropBuilderString>;

  uploader: FileUploader;
  isSmallDevice       = false;
  parsed              = false;
  hasFile             = false;
  uploading           = false;
  hasBaseDropZoneOver = false;
  hasDropZoneOver     = false;
  hoverClass          = '__color--primary __background-color--grey-light fade-in';
  bufferValue         = 50;

  fileName: string;
  fileSize: string;
  fileExtension: string;
  downloadUrl: string;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('fileArea', { static: false }) fileArea: ElementRef;

  onFileOver(e: any) {
    if (e) {
      this.fileArea.nativeElement.classList.add('__color--primary');
      this.fileArea.nativeElement.classList.add('fade-in');
    } else {
      this.fileArea.nativeElement.classList.remove('__color--primary');
      this.fileArea.nativeElement.classList.remove('fade-in');
    }
    this.hasBaseDropZoneOver = e;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  async ngOnInit() {
    super.ngOnInit();

    this.createUploader();
    this.cdRef.detectChanges();
  }

  async onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): Promise<any> {
    this.parsed    = true;
    this.uploading = false;
    this.value = this.downloadUrl;

    this.cdRef.detectChanges();
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.log(response);
  }

  reformatUnit(size: number): void {
    if (size >= 1073741824) {
      size /= 1073741824;
      this.fileSize = `${ size.toFixed(2) } GB`;
    } else if (size >= 1048576) {
      size /= 1048576;
      this.fileSize = `${ size.toFixed(2) } MB`;
    } else if (size >= 1024) {
      size /= 1024;
      this.fileSize = `${ size.toFixed(2) } KB`;
    } else if (size > 1) {
      this.fileSize = `${ size.toFixed(2) } bytes`;
    } else if (size === 1) {
      this.fileSize = `${ size.toFixed(2) } byte`;
    } else {
      this.fileSize = '0 bytes';
    }
  }

  checkIfAllowed(ext: string) {
    if (!this.allowedExtensions) {
      return true;
    }
    return this.allowedExtensions.indexOf(ext) > -1;
  }

  clickArea() {
      this.fileInput.nativeElement.click();
  }

  async onAfterAddingFile(fileItem: FileItem) {
    if (this.handlerBuilder.format === 'base64') {
      try {
        const contents = await (new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileItem._file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (e) => reject(e);
        }));

        fileItem.remove();

        this.downloadUrl = contents.toString();

        this.onSuccessItem(null, null, null, null)
          .catch(e => {
            throw e;
          });
      } catch (e) {
        this.onErrorItem(null, null, null, null)
          .catch(e => {
            throw e;
          });
      }
    } else {
      fileItem.withCredentials = false;

      this.fileName = fileItem.file.name;
      this.reformatUnit(fileItem.file.size);
      this.fileExtension = fileItem.file.name.split('.')[1];

      if (this.checkIfAllowed(this.fileExtension)) {
        this.hasFile    = true;
        this.uploading  = true;
        this.hoverClass = '';
        const{upload, download} = await this.fetchPresignedUrls(this.fileName);
        this.downloadUrl = download;
        this.uploader.options.url = upload;
        fileItem.url = upload;
        fileItem.upload();
      } else {
        fileItem.remove();
        throw new Error('Invalid file type');
      }
    }

    this.cdRef.detectChanges();
  }

  createUploader() {
    this.uploader                              = new FileUploader({
      url   : '',
      disableMultipart: true,
      method: 'PUT'
    });
    this.uploader.onErrorItem                  = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem                = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.uploader.onAfterAddingFile            = (fileItem: FileItem) => this.onAfterAddingFile(fileItem);
  }



  async fetchPresignedUrls(fileName: string) {
      const promise = this.handlerBuilder.builder.rootBuilder.apiService.get(`common/storage/tmp-upload-token?fileName=${fileName}`
      ).toPromise();
      try {
        const data = await promise;
        return data;
      } catch (e) {
        throw new Error(e);
      }
  }



}
