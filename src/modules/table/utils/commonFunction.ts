import { FULFILLED_CODE, PROCESSING_CODE, RECEIVED_CODE, PENDING_CODE } from "./constants"

export const checkColor = (status: string) => {
  if (status === FULFILLED_CODE) {
    return '#11c054'
  }

  if (status === PROCESSING_CODE) {
    return '#f1ee12'
  }

  if (status === RECEIVED_CODE) {
    return '#328ecc'
  }

  return '#788b92'
}

// check status của 1 row
export const checkStatus = (process: string | null, fulfill: string | null, receive: string | null) => {
  if (fulfill) {
    return FULFILLED_CODE
  }

  if (process) {
    return PROCESSING_CODE
  }

  if (receive) {
    return RECEIVED_CODE
  }

  return PENDING_CODE
}

export interface IFilters {
  [key: string]: (value: any) => boolean;
}

export interface TInput {
  [key: string]: any
}

export const filterArray = (array: TInput[], filters: IFilters): TInput[] => {
  const filterKeys = Object.keys(filters);
  console.log(filterKeys);

  return array.filter((item) => {
    // validates all filter criteria
    return filterKeys.every((key) => {
      // ignores non-function predicates
      if (typeof filters[key] !== 'function') return true;
      return filters[key](item[key]);
    });
  });
}