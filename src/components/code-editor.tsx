import './code-editor.css';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef, useState } from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const [theme, setTheme] = useState('dark');
  const editorRef = useRef<any>();
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');
    editorRef.current.setValue(formatted);
    console.log(editorRef.current);
  };
  return (
    <div className="editor-wrapper">
      <button
        className="button is-primary is-small theme-button-format"
        onClick={() => {
          switch (theme) {
            case 'dark':
              setTheme('light');
              break;
            case 'light':
              setTheme('dark');
              break;
          }
        }}
      >
        {console.log(theme)}
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
      <button
        //bulma css ca"button butotn-format is-primary is-small"
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        language="javascript"
        theme={theme}
        height={'100%'}
      />
    </div>
  );
};

export default CodeEditor;
