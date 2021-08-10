import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';
import last from 'lodash/last';
import Translator from './translator';

const MESSAGES_PATTERN = './public/messages/**/*.json';
const LANG_DIR = './public/lang/';

const LANG_PATTERN = './public/lang/*.json';

// Try to delete current json files from public/locales
// try {
//   fs.unlinkSync("./public/locales/data.json");
// } catch (error) {
//   console.log(error);
// }

// Merge translated json files (es.json, fr.json, etc) into one object
// so that they can be merged with the eggregated "en" object below

const mergedTranslations = globSync(LANG_PATTERN)
  .map((filename) => {
    const locale = last(filename.split('/')).split('.json')[0];
    return { [locale]: JSON.parse(fs.readFileSync(filename, 'utf8')) };
  })
  .reduce((acc, localeObj) => {
    console.log(acc, localeObj)
    return { ...acc, ...localeObj };
  }, {});
// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(MESSAGES_PATTERN)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (!collection.hasOwnProperty(id)) {
        collection[id] = defaultMessage;
      }
    });
    return collection;
  }, {});


mkdirpSync(LANG_DIR);
const oldMessages = mergedTranslations.data || {}
fs.writeFileSync(`${LANG_DIR}data.json`, JSON.stringify({ ...defaultMessages, ...oldMessages }, null, 2));
