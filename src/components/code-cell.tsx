//useRef preserve data during render cycles, does not trigger re-renders
//useState preserve
import { useEffect, useState } from 'react';
import CodeEditors from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import ResizableBox from './resizable';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    // effects run for every render and not just once. This is why React also cleans up effects from the previous render before
    // running the effects next time (returning a function)
    return () => {
      console.log('return');
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <ResizableBox direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <ResizableBox direction="horizontal">
          <CodeEditors
            initialValue="const a = 1;"
            onChange={(e) => {
              setInput(e);
            }}
          />
        </ResizableBox>

        {/* <div>
          <button onClick={onClick}>submit</button>
        </div> */}
        {/* <pre>{code}</pre> */}
        <Preview code={code} />
      </div>
    </ResizableBox>
  );
};

export default CodeCell;
