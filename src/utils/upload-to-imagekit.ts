import axios from 'axios';
import { ImageKitAuthType } from '../pages/api/imagekit-auth';

export interface ImagekitResType {
  fileId: string;
  filePath: string;
  fileType: string;
  width: number;
  height: number;
  name: string;
  size: number;
  thumbnailUrl: string;
  url: string;
  versionInfo: {
    id: string;
    name: string;
  };
  file: File;
  folder: string;
  filename: string;
}

export interface UploadFileToImageKitProps {
  file: File;
  folder?: string;
  fileName?: string;
  auth?:ImageKitAuthType;
  authApiEndpoint?:string;
}
export const uploadFileToImageKit = async ({
  file, folder = 'avatars', fileName, auth,
  authApiEndpoint = '/api/imagekit-auth',
}:UploadFileToImageKitProps):Promise<ImagekitResType> => {
  let imageKitAuth = auth;
  if (!auth) {
    const authRes = await axios.post(authApiEndpoint);

    imageKitAuth = authRes.data as ImageKitAuthType;
  }
  if (!imageKitAuth?.token) {
    throw new Error('Get imageKitAuth failed');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName || file.name);
  formData.append('folder', folder);
  formData.append('publicKey', imageKitAuth.publicKey);
  formData.append('signature', imageKitAuth.signature);
  formData.append('expire', imageKitAuth.expire.toString());
  formData.append('token', imageKitAuth.token);

  const uploadRes = await axios.post(imageKitAuth.uploadUrl, formData);
  if (uploadRes.status !== 200) {
    throw new Error('Upload failed');
  }
  return {
    ...uploadRes.data, file, folder, fileName,
  } as ImagekitResType;
};

export default uploadFileToImageKit;
