import type { NextApiRequest, NextApiResponse } from 'next';
import ImageKit from 'imagekit';

/**
 *
 * API endpoint: http://localhost:3000/api/imagekit-auth
 *
 * ============ Example of .env.local ============
 * IMAGEKIT_API_PUBLIC_KEY="public_4TznVN3Qst1FY51fJL8="
 * IMAGEKIT_API_PRIVATE_KEY="private_GDcEsLRTRpMvf5t1WII="
 * IMAGEKIT_API_END_POINT="https://ik.imagekit.io/ksos9gww"
 * IMAGEKIT_API_UPLOAD_URL="https://upload.imagekit.io/api/v1/files/upload"
 */

export interface ImageKitAuthType {
  token: string;
  expire: number;
  signature: string;
  publicKey: string ;
  urlEndpoint: string;
  uploadUrl: string ;
}

const imageKitAuth = (
  req: NextApiRequest,
  res: NextApiResponse<ImageKitAuthType>,
) => {
  const keys     = {
    publicKey  : process.env.IMAGEKIT_API_PUBLIC_KEY || 'Missing IMAGEKIT_API_PUBLIC_KEY',
    privateKey : process.env.IMAGEKIT_API_PRIVATE_KEY || 'Missing IMAGEKIT_API_PRIVATE_KEY',
    urlEndpoint: process.env.IMAGEKIT_API_END_POINT || 'Missing IMAGEKIT_API_END_POINT',
    uploadUrl  : process.env.IMAGEKIT_API_UPLOAD_URL || 'Missing IMAGEKIT_API_UPLOAD_URL',
  };
  const imagekit = new ImageKit(keys);
  const auth     = imagekit.getAuthenticationParameters();
  const rs       = { ...keys, ...auth, ...{ privateKey: undefined } };
  res.status(200).json(rs);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageKitAuthType>,
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }
  imageKitAuth(req, res);
}
