import { createContext, useContext } from 'react';

export const FIELD_GRID_COLUMNS = 12;

type FieldContextType = { span: number };
const FieldContext = createContext<FieldContextType>({
  span: FIELD_GRID_COLUMNS,
});

export const useFieldContext = () => useContext(FieldContext);
export const FieldContextProvider = FieldContext.Provider;
