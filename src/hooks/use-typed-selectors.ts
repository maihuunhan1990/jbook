import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../state';

//make typescript work with selectors
//will understand the type of data that is inside our store
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
