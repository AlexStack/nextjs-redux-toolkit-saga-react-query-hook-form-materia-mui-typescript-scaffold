import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
/**
 *
 * API endpoint: http://localhost:3000/api/cloudinary-auth
 *
 * ============ Example of .env.local ============
 * CLOUDINARY_API_KEY="98624656233"
 * CLOUDINARY_API_SECRET="eQq7lcKKGcNUr5fB_8aqNIk"
 * CLOUDINARY_API_BASE_URL="https://api.cloudinary.com/v1_1/pereey"
 * CLOUDINARY_API_EAGER="c_limit,w_1600"
 * CLOUDINARY_API_UPLOAD_URL="https://api.cloudinary.com/v1_1/pereey/image/upload"

 */

export interface CloudinaryAuthType {
  eager: string;
  publicId: string;
  timestamp: number;
  signature: string;
  uploadUrl: string;
  apiKey: string;
  urlEndpoint: string;
}

const cloudinaryAuth = (
  req: NextApiRequest,
  res: NextApiResponse<CloudinaryAuthType>,
) => {
  const keys = {
    apiKey     : process.env.CLOUDINARY_API_KEY || 'Missing CLOUDINARY_API_KEY',
    apiSecret  : process.env.CLOUDINARY_API_SECRET || 'Missing CLOUDINARY_API_SECRET',
    urlEndpoint: process.env.CLOUDINARY_API_BASE_URL || 'Missing CLOUDINARY_API_BASE_URL',
  };

  const timestamp = Math.round(new Date().getTime() / 1000);
  const eager     = req.body.eager as string || 'c_limit,w_1600';
  const publicId  = req.body.publicId as string || `public_id_${timestamp}`;
  const folder    = req.body.folder as string || 'default_folder';

  const serializedSortedParameters = `eager=${eager}&folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${keys.apiSecret}`;

  const signature = crypto.createHash('sha1').update(serializedSortedParameters, 'binary').digest('hex');

  const auth = {
    eager,
    publicId,
    timestamp,
    signature,
    uploadUrl: process.env.CLOUDINARY_API_UPLOAD_URL || 'Missing CLOUDINARY_API_UPLOAD_URL',
  };
  const rs   = { ...keys, ...auth, ...{ apiSecret: undefined } };

  res.status(200).json(rs);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CloudinaryAuthType>,
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }
  cloudinaryAuth(req, res);
}
