//useRef preserve data during render cycles, does not trigger re-renders
//useState preserve
import { useState } from 'react';
import CodeEditors from './code-editor';
import Preview from './preview';
import bundle from '../bundler';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditors
        initialValue="const a = 1;"
        onChange={(e) => {
          setInput(e);
        }}
      />
      <div>
        <button onClick={onClick}>submit</button>
      </div>
      <pre>{code}</pre>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
