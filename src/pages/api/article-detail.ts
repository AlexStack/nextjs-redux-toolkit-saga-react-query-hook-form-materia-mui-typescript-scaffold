// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { mainConfig } from '../../configs/main-config';
import { BASE_API_URI } from '../../constants/article-const';
import { consoleLog } from '../../utils/console-log';
import { Article } from '../../types/article-types';

const fs = require('fs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article>,
) {
  const id       = req.query.id as string;
  const jsonFile = `${mainConfig.dataFilePath}/article-${id}.json`;
  try {
    if (mainConfig.isFetchDataFromLocal) {
      const fsStats = fs.statSync(jsonFile, { throwIfNoEntry: false });
      if (fsStats && 'mtime' in fsStats) {
      // consoleLog('fs stats', fsStats);
        const articleData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        if ('id' in articleData) {
          consoleLog('🚀 fetch article data form local:', jsonFile);
          res.status(200).json(articleData as Article);
          return;
        }
      }
    }

    const rs   = await fetch(`${BASE_API_URI}/articles/${id}`);
    const data = await rs.json();

    // save data to json file
    if (('id' in data) && 'body_html' in data) {
      fs.writeFileSync(jsonFile, JSON.stringify(data), 'utf8');
      consoleLog('🚀 Save article data to local:', jsonFile);

      res.status(200).json(data as Article);
      return;
    }

    consoleLog('🚀 wrong article formate', data);
  } catch (error) {
    consoleLog('🚀 ~ file: article-detail.ts ~ line 41 ~ error', error);
  }
}
