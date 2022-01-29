import ReactDOM from 'react-dom';
//npm install bulmaswatch
//a popular css lib
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeCell from './components/code-cell';
import { TextEditor } from './components/text-editor';

const App = () => {
  return (
    <div>
      <TextEditor />
      {/* <CodeCell /> */}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
