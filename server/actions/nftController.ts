import { nfts } from '../schema';
import { db } from ".."; // 确保路径正确
import { eq } from 'drizzle-orm';

async function createNFT(tokenURI: string, tokenId: string, userId: number) {
  const tokenIdBigInt = BigInt(tokenId); // 将字符串转换为 BigInt

  const result = await db.insert(nfts).values({
    tokenId: tokenIdBigInt,
    tokenURI,
    userId: BigInt(userId), // 将 userId 转换为 bigint 类型
    mintedAt: new Date(), // 或者使用你的默认值函数
  }).execute();
  return result;
}

// 获取所有NFTs
async function getAllNFTs() {
  try {
    const result = await db.select().from(nfts).execute();
    return result;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw new Error('Unable to fetch NFTs');
  }
}

// 根据ID获取NFT
async function getNFTById(id: number) {
  try {
    const result = await db.select().from(nfts).where(eq(nfts.userId, BigInt(id)));
  
    return result || null; // 返回第一个匹配的结果或 null
  } catch (error) {
    console.error('Error fetching NFT by ID:', error);
    throw new Error('Unable to fetch NFT');
  }
}

// 更新NFT信息
async function updateNFT(id: number, updates: Partial<typeof nfts.$inferInsert>) {
  try {
    const result = await db
      .update(nfts)
      .set(updates)
      .where(eq(nfts.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error updating NFT:', error);
    throw new Error('Unable to update NFT');
  }
}

// 删除NFT
async function deleteNFT(id: number) {
  try {
    const result = await db
      .delete(nfts)
      .where(eq(nfts.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error deleting NFT:', error);
    throw new Error('Unable to delete NFT');
  }
}

// 导出控制器函数
export const nftController = {
  createNFT,
  getAllNFTs,
  getNFTById,
  updateNFT,
  deleteNFT,
};