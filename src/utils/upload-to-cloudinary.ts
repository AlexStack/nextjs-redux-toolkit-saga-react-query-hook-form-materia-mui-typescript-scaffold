import axios from 'axios';
import { CloudinaryAuthType } from '../pages/api/cloudinary-auth';

export interface CloudinaryResType {
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

export interface UploadFileToCloudinaryProps {
  file: File;
  folder?: string;
  fileName?: string;
  auth?:CloudinaryAuthType;
  authApiEndpoint?:string;
  eager?:string;
}
export const uploadFileToCloudinary = async ({
  file, folder = 'default_folder', fileName, auth,
  authApiEndpoint = '/api/cloudinary-auth',
  eager = 'c_limit,w_1500',
}:UploadFileToCloudinaryProps):Promise<CloudinaryResType> => {
  let cloudinaryAuth = auth;
  if (!auth) {
    const publicId = fileName || file.name.slice(0, file.name.lastIndexOf('.')).replace(/\s+/g, '_');
    const authRes  = await axios.post(authApiEndpoint, {
      folder, publicId, eager,
    });

    cloudinaryAuth = authRes.data as CloudinaryAuthType;
  }
  if (!cloudinaryAuth?.signature) {
    throw new Error('Get cloudinaryAuth failed');
  }

  const formData = new FormData();
  formData.append('file', file);
  // formData.append('fileName', fileName || file.name);
  formData.append('folder', folder);
  formData.append('api_key', cloudinaryAuth.apiKey);
  formData.append('signature', cloudinaryAuth.signature);
  formData.append('timestamp', cloudinaryAuth.timestamp.toString());
  formData.append('public_id', cloudinaryAuth.publicId);
  formData.append('eager', cloudinaryAuth.eager);

  const uploadRes = await axios.post(cloudinaryAuth.uploadUrl, formData);
  if (uploadRes.status !== 200) {
    throw new Error('Upload failed');
  }
  return {
    ...uploadRes.data, file, folder, fileName,
  } as CloudinaryResType;
};

export default uploadFileToCloudinary;
