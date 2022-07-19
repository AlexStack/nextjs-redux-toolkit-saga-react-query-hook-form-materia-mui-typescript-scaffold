// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const test1      = 22;
  const test2abc   = 33;
  const test3a     = 44;
  const test4ccccc = '55sdfds';
  const obj        = {
    test1   : '22sdfsdf',
    test2abc: 33,
    test3a  : 44,
  };
  res.status(200).json({ name: 'John Doe' });
}
