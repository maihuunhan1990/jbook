//useRef preserve data during render cycles, does not trigger re-renders
//useState preserve
import { useEffect, useState } from 'react';
import CodeEditors from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import ResizableBox from './resizable';
import { Cell } from '../state';
import { useAction } from '../hooks/use-actions';
import { NewLineKind } from 'typescript';

interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const { updateCell } = useAction();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    // effects run for every render and not just once. This is why React also cleans up effects from the previous render before
    // running the effects next time (returning a function)
    return () => {
      console.log('return');
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <ResizableBox direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <ResizableBox direction="horizontal">
          <CodeEditors
            initialValue={cell.content}
            onChange={(value) => {
              updateCell(cell.id, value);
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
