// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { mainConfig } from '../../configs/main-config';
import { BASE_API_URI, ITEMS_PER_PAGE } from '../../constants/article-const';
import { consoleLog } from '../../utils/console-log';
import { Article } from '../../types/article-types';

const fs = require('fs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article[]>,
) {
  const page = (req.query.page as string) || '1';
  const tag  = req.query.tag as string;

  const apiEndpoint = `${BASE_API_URI}/articles?tag=${tag}&page=${page}&per_page=${ITEMS_PER_PAGE}`;
  const fileName    = tag.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
  const jsonFile    = `${mainConfig.dataFilePath}/tag-${fileName}-${page}-${ITEMS_PER_PAGE}.json`;

  try {
    // read data from local json file first
    const fsStats = fs.statSync(jsonFile, { throwIfNoEntry: false });
    if (fsStats && 'mtime' in fsStats) {
      // consoleLog('fs stats', fsStats);
      const articleData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      if (Array.isArray(articleData) && articleData.length && 'id' in articleData[0]) {
        consoleLog('🚀 fetch article tag list form local:', jsonFile);
        res.status(200).json(articleData as Article[]);
        return;
      }
    }

    const rs   = await fetch(`${apiEndpoint}`);
    const data = await rs.json();

    // save data to json file
    if (Array.isArray(data) && data.length && 'id' in data[0] && 'title' in data[0]) {
      fs.writeFileSync(jsonFile, JSON.stringify(data), 'utf8');
      consoleLog('🚀 Save article tag list to local:', jsonFile);

      res.status(200).json(data as Article[]);
      return;
    }

    consoleLog('🚀 wrong article tag list formate', data);
  } catch (error) {
    consoleLog('🚀 error', error);
  }
}
