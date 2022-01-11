import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'fileCache',
});

//localForage is local cache
const test = async () => {
  await fileCache.setItem('color', 'red');
  const color = await fileCache.getItem('color');
  console.log('here');
  console.log(color);
};
test();

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //telling esbuild to use custom plugin that we built, if it's index.js then return that object instead of getting it from the filesystem (where your dependencies are)
        //es build is a transpiler and bundler
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          //the ./ in will delete the last "directory" in the url
          // pathUrl = '/nest-testpkg/src/index.js'
          // newpath = new URL('./, pathUrl)
          // newpath == '/nest-testpkg/src'

          //resolveDir is provided by esBuild to provide to the next file we are trying to resolve
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
