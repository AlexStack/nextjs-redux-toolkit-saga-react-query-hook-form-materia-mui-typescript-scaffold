import { AvatarResponse, UploadFileParams } from '../types/article-types';
import { uploadFileToCloudinary } from '../utils/upload-to-cloudinary';
import { uploadFileToImageKit } from '../utils/upload-to-imagekit';

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

export const uploadAvatar = async ({ file, provider }:UploadFileParams):Promise<AvatarResponse> => {
  const uploadRes = provider === 'cloudinary'
    ? await uploadFileToCloudinary({ file, folder: 'avatars2', eager: 'c_limit,w_120' })
    : await uploadFileToImageKit({ file, folder: 'avatars3' });

  console.log('🚀 ~ file: user-api.ts ~ line 12 ~ uploadAvatar ~ uploadRes', uploadRes);
  return { avatarUrl: `${uploadRes.url}?tr=w-150,c-at_max` };
};

export const reactQueryFn = {
  uploadAvatar: async (params:ReactQueryFnProps<UploadFileParams>)
  :Promise<AvatarResponse> => uploadAvatar(params.queryKey[1]),

};
