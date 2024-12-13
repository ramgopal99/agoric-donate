// @ts-check
import { Far } from '@endo/marshal';
import { makeHelpers } from '@agoric/deploy-script-support';

/**
 * @param {*} zcf The Zoe Contract Facet
 */
const start = async (zcf) => {
  // State to store our sentence
  let storedSentence = '';

  // Create the public facet that users will interact with
  const publicFacet = Far('SentenceStorage', {
    storeSentence: (sentence) => {
      storedSentence = sentence;
      return `Sentence stored successfully: ${sentence}`;
    },
    
    getSentence: () => {
      return storedSentence;
    },
  });

  // Return the public facet
  return harden({ publicFacet });
};

harden(start);
export { start };
