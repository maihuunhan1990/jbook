import ReactDOM from 'react-dom';
//npm install bulmaswatch
//a popular css lib
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { TextEditor } from './components/text-editor';
import { Provider } from 'react-redux';
import { store } from './state';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
        {/* <CodeCell /> */}
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
