import { AvatarResponse } from '../types/article-types';
import { uploadFileToImageKit } from '../utils/upload-to-imagekit';

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

export const uploadAvatar = async (file:File):Promise<AvatarResponse> => {
  const uploadRes = await uploadFileToImageKit({ file });
  return { avatarUrl: `${uploadRes.url}?tr=w-150,c-at_max` };
};

export const reactQueryFn = {
  uploadAvatar: async (params:ReactQueryFnProps<File>)
  :Promise<AvatarResponse> => uploadAvatar(params.queryKey[1]),

};
