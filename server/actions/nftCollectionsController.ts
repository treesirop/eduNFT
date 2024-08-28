import { nftCollections } from '../schema';
import { db } from ".."; // 确保路径正确
import { eq } from 'drizzle-orm';

// 创建NFT合集
async function createNFTCollection(name: string, is_approved: boolean,contractAddress: string, teacher_id: number) {

  const result = await db.insert(nftCollections).values({
    name,
    is_approved,
    contractAddress,
    teacherId: BigInt(teacher_id),
    createdAt: new Date(), // 或者使用你的默认值函数
  }).execute();
  return result;
}

// 获取所有NFT合集
async function getAllNFTCollections() {

  try {
    const result = await db.select().from(nftCollections).execute();
    return result;
  } catch (error) {
    console.error('Error fetching NFT Collections:', error);
    throw new Error('Unable to fetch NFT Collections');
  } finally {
    
  }
}

// 根据ID获取NFT合集
async function getNFTCollectionByTeacherId(teacher_id: bigint) {

  try {
    const result = await db.select().from(nftCollections).where(eq(nftCollections.teacherId, teacher_id));
    return result || null; // 返回第一个匹配的结果或 null  
  } catch (error) {
    console.error('Error fetching NFT Collection by ID:', error);
    throw new Error('Unable to fetch NFT Collection');
  }
}

// 根据ID获取NFT合集
async function getNFTCollectionByContractAddress(hash: string) {

  try {
    const result = await db.select().from(nftCollections).where(eq(nftCollections.contractAddress, hash)).limit(1);
    return result[0] || null; // 返回第一个匹配的结果或 null  
  } catch (error) {
    console.error('Error fetching NFT Collection by contractAddress:', error);
    throw new Error('Unable to fetch NFT Collection');
  }
}


// 更新NFT合集信息
async function updateNFTCollection(id: number, updates: Partial<typeof nftCollections.$inferInsert>) {
  if (!id) {
    throw new Error('Invalid parameters: id is missing');
  }
  try {
    const result = await db
      .update(nftCollections)
      .set(updates)
      .where(eq(nftCollections.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error updating NFT Collection:', error);
    throw new Error('Unable to update NFT Collection');
  }
}

// 删除NFT合集
async function deleteNFTCollection(id: number) {
  try {
    const result = await db
      .delete(nftCollections)
      .where(eq(nftCollections.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error deleting NFT Collection:', error);
    throw new Error('Unable to delete NFT Collection');
  }
}

// 导出控制器函数
export const nftCollectionController = {
  createNFTCollection,
  getAllNFTCollections,
  getNFTCollectionByTeacherId,
  updateNFTCollection,
  deleteNFTCollection,
  getNFTCollectionByContractAddress
};