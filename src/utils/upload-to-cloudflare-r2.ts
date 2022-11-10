import axios from 'axios';
import { CloudflareR2AuthType } from '../pages/api/cloudflare-r2';
import { consoleLog } from './console-log';

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
}
export const uploadFileToCloudflareR2 = async ({
  file, folder = 'avatars', fileName, auth,
  authApiEndpoint = '/api/cloudflare-r2',
}:UploadFileToCloudflareR2Props):Promise<CloudflareR2ResType> => {
  let cloudflareR2Auth = auth;

  const objKey = `${folder}/${(fileName || file.name).trim().replace(/\s+/g, '_')}`;
  if (!auth) {
    const authRes = await axios.post(authApiEndpoint, { objKey, objType: file.type });

    cloudflareR2Auth = authRes.data as CloudflareR2AuthType;
  }
  if (!cloudflareR2Auth?.signedUrl) {
    throw new Error('Get cloudflareR2Auth failed');
  }

  // curl -X PUT https://my-bucket-name.<accountid>.r2.cloudflarestorage.com/dog.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential<credential>&X-Amz-Date=<timestamp>&X-Amz-Expires=3600&X-Amz-Signature=<signature>&X-Amz-SignedHeaders=host&x-id=PutObject -F "data=@dog.png"

  // "https://memes.7bc05994f39e3b996292718545a408e1.r2.cloudflarestorage.com/gifs/1-v97.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=03889894fde0d44a8064cb385ba14196%2F20221109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20221109T193708Z&X-Amz-Expires=3600&X-Amz-Signature=a2918027c7b820bdfcf0f574d1cc21f4421fc7d243c28d73213bee0fd7f3101f&X-Amz-SignedHeaders=host&x-id=PutObject"

  const formData = new FormData();
  formData.append('file', file);
  formData.append('Content-Type', file.type);
  // formData.append('fileName', fileName || file.name);
  // formData.append('folder', folder);
  // formData.append('publicKey', cloudflareR2Auth.publicKey);
  // formData.append('signature', cloudflareR2Auth.signature);
  // formData.append('expire', cloudflareR2Auth.expire.toString());
  // formData.append('token', cloudflareR2Auth.token);

  const uploadRes = await axios.put(cloudflareR2Auth.signedUrl, file, {
    // headers: { 'Content-Type': 'multipart/form-data' },
    // headers: { 'Content-Type': file.type },
  });

  // const uploadRes = await fetch(cloudflareR2Auth.signedUrl, {
  //   body   : file,
  //   method : 'PUT',
  //   mode   : 'cors',
  //   headers: { 'Content-Type': 'application/octet-stream' },
  // });
  consoleLog(
    `\nResponse returned by signed URL: ${uploadRes}\n`,
  );
  if (uploadRes.status !== 200) {
    throw new Error('Upload failed');
  }

  const url = `${cloudflareR2Auth.urlPrefix}/${objKey}`;

  return {
    url, file, folder, objKey,
  };
};

// export default uploadFileToCloudflareR2;
