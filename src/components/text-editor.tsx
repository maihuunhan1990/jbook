import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';

export const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');

  useEffect(() => {
    const listener = () => {
      //   setEditing(false);
      console.log('listener');
    };
    console.log('useEffect called');
    document.addEventListener('click', listener, { capture: true });
    return () => {
      console.log('cleaning up');
      document.removeEventListener('click', listener, { capture: true });
    };
  }, [text]);

  console.log(editing);
  if (editing) {
    return (
      <div>
        <MDEditor />
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(false)}>
      <textarea onChange={(e) => setText(e.target.value)} value={text} />
      <textarea onChange={(e) => setText2(e.target.value)} value={text2} />
      <MDEditor.Markdown source={'# Header'} />
    </div>
  );
};
