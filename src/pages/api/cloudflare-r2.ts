import type { NextApiRequest, NextApiResponse } from 'next';
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 *
 * API endpoint: http://localhost:3000/api/cloudflare-r2
 *
 * ============ Example of .env.local ============
 * CLOUDFLARE_R2_ACCOUNT_ID="7bc05994f39e3b996"
 * CLOUDFLARE_R2_ACCESS_KEY_ID="038898385ba14196"
 * CLOUDFLARE_R2_SECRET_ACCESS_KEY="6b8d22ff2ce81f75b7f6"
 * CLOUDFLARE_R2_DEFAULT_BUCKET="memes"
 */

export interface AlertMessage {
  message: string ;
}

export interface CloudflareR2AuthType {
  expire: number;
  signedUrl: string;
  putObjectKey: string ;
}

const cloudflareR2Auth = async (
  req: NextApiRequest,
  res: NextApiResponse<any>,
) => {
  const configs = {
    accountId      : process.env.CLOUDFLARE_R2_ACCOUNT_ID || 'Missing CLOUDFLARE_R2_API_ACCOUNT_ID',
    accessKeyId    : process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || 'Missing CLOUDFLARE_R2_ACCESS_KEY_ID',
    urlEndpoint    : process.env.CLOUDFLARE_R2_API_END_POINT || 'Missing CLOUDFLARE_R2_API_END_POINT',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 'Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    bucketName     : process.env.CLOUDFLARE_R2_DEFAULT_BUCKET || 'Missing CLOUDFLARE_R2_DEFAULT_BUCKET',
  };
  const S3      = new S3Client({
    region     : 'auto',
    endpoint   : `https://${configs.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId    : configs.accessKeyId,
      secretAccessKey: configs.secretAccessKey,
    },
  });

  const dataType       = req.body.dataType as string || 'signedUrl';
  const putObjectKey   = req.body.objKey as string || 'gifs/test.gif';
  const objContentType = req.body.objType as string || 'image/jpeg';
  const expiresIn      = 3600;

  if (dataType === 'bucketList') {
    const bucketList = await S3.send(new ListBucketsCommand(''));
    res.json(bucketList);
  } else if (dataType === 'objList') {
    const objList = await S3.send(new ListObjectsV2Command({ Bucket: configs.bucketName }));
    res.json(objList);
  } else if (dataType === 'signedUrl') {
    const uploadSignedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand(
        {
          Bucket     : configs.bucketName,
          Key        : putObjectKey,
          ContentType: objContentType,
          ACL        : 'public-read',
          // ContentDisposition: 'attachment',
        },
      ),

      { expiresIn },
    );
    res.json({ signedUrl: uploadSignedUrl, putObjectKey, expire: expiresIn });
  } else {
    res.json({ message: 'Wrong data type found' });
  }

  res.status(200).end();
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CloudflareR2AuthType | AlertMessage>,
): Promise<void> => {
  if (req.method !== 'POST') {
    res.json({ message: 'Method not allowed' });
    res.status(405).end();
  }
  await cloudflareR2Auth(req, res);
};

export default handler;
