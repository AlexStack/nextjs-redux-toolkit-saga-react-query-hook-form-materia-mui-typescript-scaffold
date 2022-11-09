import { AvatarResponse, UploadFileParams } from '../types/article-types';
import { uploadFileToCloudinary } from '../utils/upload-to-cloudinary';
import { uploadFileToImageKit } from '../utils/upload-to-imagekit';
import { consoleLog } from '../utils/console-log';
import { uploadFileToCloudflareR2 } from '../utils/upload-to-cloudflare-r2';

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

export const uploadAvatar = async ({ file, provider }:UploadFileParams):Promise<AvatarResponse> => {
  // const uploadRes = provider === 'cloudinary'
  //   ? await uploadFileToCloudinary({ file, folder: 'avatars2', eager: 'c_limit,w_120' })
  //   : await uploadFileToImageKit({ file, folder: 'avatars3' });

  // assign uploadRes base on different provider
  let uploadRes;
  switch (provider) {
  case 'cloudinary':
    uploadRes = await uploadFileToCloudinary({ file, folder: 'avatars2', eager: 'c_limit,w_120' });
    break;
  case 'cloudflare-r2':
    uploadRes = await uploadFileToCloudflareR2({ file, folder: 'gifs' });
    break;
  case 'imagekit':
  default:
    uploadRes = await uploadFileToImageKit({ file, folder: 'avatars3' });
    break;
  }

  consoleLog('🚀 ~ file: user-api.ts ~ line 12 ~ uploadAvatar ~ uploadRes', uploadRes);
  return { avatarUrl: `${uploadRes.url}?tr=w-150,c-at_max` };
};

export const reactQueryFn = {
  uploadAvatar: async (params:ReactQueryFnProps<UploadFileParams>)
  :Promise<AvatarResponse> => uploadAvatar(params.queryKey[1]),

};
