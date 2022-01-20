import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  //esbuild will do .onResolve then .onload until all the file imports are complete
  //essentially if index.js it will do .onResolve first then .onBuild and see that index.js has an import 'import axios from 'axios'' it will now do .onResolve/onBuild for the axios file etc
  return {
    name: 'unpkg-path-plugin',
    //build here represents the bundling process. The entire process of finding a file, loading it, parsing it and transpiling it, joining files together
    setup(build: esbuild.PluginBuild) {
      //can have multiple onResolve, can use the filter to filter out specific files you want to load up
      // namespace can also be added to the onResolve exp {build.onResolve({filter:/.*/, namespace: 'a'})} will only load files with namespace 'a' defined

      //handle root entry file of 'index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      //filter is regex saying if (args.path.includes('./') || args.path.includes('../')) {

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });
      //Hanlde main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
