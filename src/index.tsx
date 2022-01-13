import * as esbuild from 'esbuild-wasm';
//useRef preserve data during render cycles, does not trigger re-renders
//useState preserve
import { useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  //make a box so it doesn't change
  const ref = useRef<any>();
  const iframe = useRef<any>();
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
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
    setCode(result.outputFiles[0].text);
  };

  const html = `
  <html>
    <head></head>
    <body>
      <div id="root"> </div>
      <script>
        window.addEventListener('message', (event) => {
          eval(event.data);
        }, false);
      </script>
    </body>
  </html>
  `;

  return (
    <div>
      <textarea value={input} onChange={onTextAreaChange}></textarea>
      <div>
        <button onClick={onClick}>submit</button>
      </div>
      <pre>{code}</pre>
      <iframe
        //ref is set to iframe
        ref={iframe}
        title="iframe"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
