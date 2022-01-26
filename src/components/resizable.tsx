import './resizable.css';
import {
  ResizableBox as MResizableBox,
  ResizableBoxProps,
} from 'react-resizable';
import { useEffect, useState } from 'react';

type ResizableProps = {
  direction: 'horizontal' | 'vertical';
};
const ResizableBox: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      //called debouncing
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    //listening to a 'resize' event, will trigger the listener function
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  });

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      height: Infinity,
      width: width,
      resizeHandles: ['e'],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
      onResizeStop: (event, data) => {
        // console.log(data);
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, innerHeight * 0.1],
    };
  }
  return <MResizableBox {...resizableProps}>{children}</MResizableBox>;
};

export default ResizableBox;
