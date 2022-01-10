import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
//localForage is local cache
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'fileCache',
});
const test = async () => {
  await fileCache.setItem('color', 'red');
  const color = await fileCache.getItem('color');
  console.log('here');
  console.log(color);
};
test();

export const unpkgPathPlugin = () => {
  //esbuild will do .onResolve then .onload until all the file imports are complete
  return {
    name: 'unpkg-path-plugin',
    //build here represents the bundling process. The entire process of finding a file, loading it, parsing it and transpiling it, joining files together
    setup(build: esbuild.PluginBuild) {
      //can have multiple onResolve, can use the filter to filter out specific files you want to load up
      // namespace can also be added to the onResolve exp {build.onResolve({filter:/.*/, namespace: 'a'})} will only load files with namespace 'a' defined
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        //telling esbuild to use custom plugin that we built, if it's index.js then return that object instead of getting it from the filesystem (where your dependencies are)
        //es build is a transpiler and bundler
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
            import React from 'react'
            console.log(React)
            `,
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
