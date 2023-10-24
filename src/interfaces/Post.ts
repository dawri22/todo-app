import { Post } from "@prisma/client";
import { type } from "os";

 export type CreatePost = Omit<Post, 'id'| 'createdAt' | 'updatedAt' | 'authorId' >;
 export type UpdatePost = Partial<CreatePost>;