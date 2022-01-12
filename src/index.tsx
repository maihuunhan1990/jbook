import * as esbuild from 'esbuild-wasm';
//useRef preserve data during render cycles, does not trigger re-renders
//useState preserve
import { ChangeEvent, useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  //similar to componenentDidMount and componentDidUpdate
  //will call this method after DOM updates
  useEffect(() => {
    startService();
  }, []);
  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    //use index.js as an entry point to build bundle
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    console.log(result);
    setCode(result.outputFiles[0].text);
    try {
      eval(result.outputFiles[0].text);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <textarea value={input} onChange={onTextAreaChange}></textarea>
      <div>
        <button onClick={onClick}>submit</button>
      </div>
      <pre>{code}</pre>
      <iframe src="/test.html" />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
