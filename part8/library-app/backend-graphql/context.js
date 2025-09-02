import DataLoader from "dataloader";
import Book from "./models/book.js";
import mongoose from "mongoose";

function createLoaders() {
  return {
    bookCountLoader: new DataLoader(async (authorIds) => {
      const objectIds = authorIds.map((id) => new mongoose.Types.ObjectId(id));

      const counts = await Book.aggregate([
        { $match: { author: { $in: objectIds } } },
        { $group: { _id: "$author", count: { $sum: 1 } } },
      ]);

      const countMap = {};
      counts.forEach((b) => (countMap[b._id.toString()] = b.count));

      return authorIds.map((id) => countMap[id.toString()] || 0);
    }),
  };
}

export default createLoaders;
