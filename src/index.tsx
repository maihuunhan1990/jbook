import ReactDOM from 'react-dom';
//npm install bulmaswatch
//a popular css lib
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeCell from './components/code-cell';
import { useState } from 'react';
import { TextEditor } from './components/text-editor';

const App = () => {
  const testString = [{ message: 'test' }];
  const [test, setTest] = useState(testString);
  // const update = ({e: React.ChangeEvent<HTMLInputElement>}) => {
  //@ts-ignore
  const update = ({ e, index }) => {};
  return (
    <div>
      <TextEditor />
      {/* <CodeCell /> */}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
