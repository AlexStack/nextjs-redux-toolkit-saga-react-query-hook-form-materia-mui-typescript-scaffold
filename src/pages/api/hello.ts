// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { mainConfig } from '../../configs/main-config';
import { Article } from '../../types/article-types';

const fs = require('fs');

// type Data = {
//   name: string
// };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const files:string[] = fs.readdirSync(mainConfig.dataFilePath);
  if (!mainConfig.isClientSide) {
    const allSlugs = files.map((file) => {
      if (!file.includes('tag-')) {
        return [];
      }
      const articleData = JSON.parse(fs.readFileSync(`${mainConfig.dataFilePath}/${file}`, 'utf8'));
      if (Array.isArray(articleData) && articleData.length && 'id' in articleData[0] && articleData[0].cover_image) {
        return articleData.map((article:Article) => `${article.slug}-${article.id}`);
      }

      return [];
    });

    res.status(200).json(allSlugs.flat());
  }

  res.status(200).json({ name: 'John Doe' });
}
