import axios from 'axios';
import { mainConfig } from '../configs/main-config';
import { CloudflareR2AuthType } from '../pages/api/cloudflare-r2';
import { UploadFileParams } from '../types/article-types';
import { consoleLog } from './console-log';
import { uploadFileToImageKit } from './upload-to-imagekit';

export interface CloudflareR2ResType {
  url: string;
  file: File;
  folder: string;
  objKey: string;
}

export interface UploadFileToCloudflareR2Props {
  file: File;
  folder?: string;
  fileName?: string;
  auth?:CloudflareR2AuthType;
  authApiEndpoint?:string;
  fromProvider?: UploadFileParams['provider'];
}

export interface UploadByPresignedUrlProps {
  file: File;
  folder: string;
  objKey: string;
  cloudflareR2Auth: CloudflareR2AuthType;
  fileData?: Blob | File;
}

/**
 * set allow CORS first:
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedHeader>content-type</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
 */
const uploadByPresignedUrl = async ({
  file,
  folder,
  objKey,
  cloudflareR2Auth,
  fileData,
}:UploadByPresignedUrlProps) => {
  const uploadRes = await axios.put(cloudflareR2Auth.signedUrl, fileData || file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  consoleLog('🚀 ~ file: upload-to-cloudflare-r2.ts ~ line 67 ~ uploadRes55', uploadRes);

  const url = `${cloudflareR2Auth.urlPrefix}/${objKey}`;

  return {
    url, file, folder, objKey,
  };
};

const uploadFromImagekit = async ({
  file,
  folder,
  objKey,
  cloudflareR2Auth,
}:UploadByPresignedUrlProps) => {
  const imageKitRes     = await uploadFileToImageKit({
    file, folder,
  });
  const resizedImageUrl = `${imageKitRes.url}?tr=w-${mainConfig.maxImageWidth},c-at_max`;

  const resizedImageRes = await axios.get(resizedImageUrl, { responseType: 'blob' });

  consoleLog('🚀 ~ file: upload-to-cloudflare-r2.ts ~ line 46 ~ imageKitRes', imageKitRes, resizedImageUrl, resizedImageRes);

  return uploadByPresignedUrl({
    file, folder, objKey, cloudflareR2Auth, fileData: resizedImageRes.data,
  });
};

export const uploadFileToCloudflareR2 = async ({
  file, folder = 'avatars', auth, fromProvider = 'imagekit',
  authApiEndpoint = '/api/cloudflare-r2',
}:UploadFileToCloudflareR2Props):Promise<CloudflareR2ResType> => {
  let cloudflareR2Auth = auth;

  // const objKey = `${folder}/${(fileName || file.name).trim().replace(/\s+/g, '_')}`;

  // get lower file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // generate objKey by imageId and date time string
  const objKey = `${folder}/${new Date().toISOString().replace(/:/g, '-')}.${fileExtension}`;

  if (!auth) {
    const authRes = await axios.post(authApiEndpoint, { objKey, objType: file.type });

    cloudflareR2Auth = authRes.data as CloudflareR2AuthType;
  }

  if (!cloudflareR2Auth?.signedUrl) {
    throw new Error('Get cloudflareR2Auth failed');
  }

  if (fromProvider === 'imagekit') {
    return uploadFromImagekit({
      file, folder, objKey, cloudflareR2Auth,
    });
  }

  return uploadByPresignedUrl({
    file, folder, objKey, cloudflareR2Auth,
  });
};
