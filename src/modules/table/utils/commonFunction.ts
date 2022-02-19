import { FULFILLED_CODE, PROCESSING_CODE, RECEIVED_CODE } from "./constants"

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