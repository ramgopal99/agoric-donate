// @ts-ignore
import { Far, harden } from '@endo/marshal';
import { makeStore } from '@agoric/store';

/**
 * @param {Object} param0
 * @param {import('@agoric/store').Store} param0.board
 */
export const start = async ({ board }) => {
  // Store for file metadata
  const fileStore = makeStore('fileHash');
  
  const fileStorage = {
    storeFile: (hash, metadata) => {
      const fileMetadata = {
        name: `${metadata.name}`,
        size: BigInt(metadata.size),
        type: `${metadata.type}`,
        timestamp: BigInt(Date.now()),
      };
      fileStore.init(hash, harden(fileMetadata));
      return hash;
    },
    
    getFile: (hash) => {
      return fileStore.get(hash);
    },
    
    getAllFiles: () => {
      return [...fileStore.entries()].map(([hash, metadata]) => ({
        hash,
        ...metadata,
      }));
    },
  };

  const creatorFacet = Far('FileStorage Creator', {
    ...fileStorage,
  });

  const publicFacet = Far('FileStorage Public', {
    getFile: fileStorage.getFile,
    getAllFiles: fileStorage.getAllFiles,
  });

  return { creatorFacet, publicFacet };
};
