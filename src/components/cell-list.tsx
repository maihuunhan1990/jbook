import { useTypedSelector } from '../hooks/use-typed-selectors';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) => {
    const order = cells?.order;
    const data = cells?.data;

    return order?.map((id) => {
      //@ts-ignore
      //immer is causing this issue
      //todo debug why immer is causing this issue
      return data[id];
    });
  });
  const renderedCells = cells?.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));
  return <div>{renderedCells}</div>;
};

export default CellList;
