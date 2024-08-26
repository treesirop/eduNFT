"use server"
import { nftCollectionController } from "@/server/actions/nftCollectionsController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        const { name, is_approved, contractAddress, teacher_id } = req.body;
        const createUserResult = await nftCollectionController.createNFTCollection(name, is_approved, contractAddress, teacher_id);
        res.status(201).json(createUserResult);
        break;

        case 'GET':
            if (req.query.teacherId) {
              const { teacherId = '0' } = req.query; // 默认值为 '0'
              const teacherIdBigInt = BigInt(typeof teacherId === 'string' ? teacherId : '0');
              console.log(teacherIdBigInt);
    
              const allUsers = await nftCollectionController.getNFTCollectionByTeacherId(teacherIdBigInt);
              const serializedUsers = allUsers.map(user => {
                return {
                  ...user,
                  teacherId: user.teacherId.toString()
                };
              });
              res.status(200).json(serializedUsers);
            } else {
              const allCollections = await nftCollectionController.getAllNFTCollections();
              const serializedCollections = allCollections.map(collection => {
                return {
                  ...collection,
                  teacherId: collection.teacherId.toString()
                };
              });
              res.status(200).json(serializedCollections);
            }
            break;

      case 'DELETE':
        const { collectionId } = req.body;
        const deleteResult = await nftCollectionController.deleteNFTCollection(collectionId);
        res.status(200).json(deleteResult);
        break;

      default:
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}