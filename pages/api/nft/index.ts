// pages/api/your-api-route.ts
import Cors from 'cors';
import { nftController } from "@/server/actions/nftController";
import { userController } from "@/server/actions/userController";
import { NextApiRequest, NextApiResponse } from "next";

// 初始化 CORS 中间件
const cors = Cors({
  methods: ['GET', 'POST'],
  origin: '*', // 允许所有来源，你可以根据需要限制特定的域名
});

// 辅助函数来处理 CORS 中间件
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 运行 CORS 中间件
  await runMiddleware(req, res, cors);

  try {
    switch (req.method) {
      case 'POST':
        const { tokenURI, tokenId, userAddress } = req.body;
        const userid = await userController.getUserIdByAddress(userAddress);
        const createNFTResult = await nftController.createNFT(tokenURI, tokenId, userid.id);
        res.status(201).json(createNFTResult);
        break;

      case 'GET':
        const { address } = req.query;
        if (typeof address !== 'string') {
          res.status(400).json({ message: 'Invalid address' });
          return;
        }
        const user_id = await userController.getUserIdByAddress(address);
        const NFTs = await nftController.getNFTById(user_id.id);
        const serializedNfts = NFTs.map(nft => {
          return {
            ...nft,
            userId: nft.userId.toString(),
          };
        });
        res.status(200).json(serializedNfts);
        break;

      default:
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}