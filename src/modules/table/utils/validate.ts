import { ITableData } from './../../../models/tableModel';
const validateField = (field: string, value: string) => {
  if (value) return '';
  let fieldRequire = '';
  switch (field) {
    case 'date':
      fieldRequire = "dateRequire";
      break;
    case 'currency':
      fieldRequire = "currencyRequire";
      break;
    case 'clientID':
      fieldRequire = 'clientRequire'
      break;
  }

  return fieldRequire
}

const validateTotal = (values: string) => {
  if (parseFloat(values)) {
    return ''
  }
  return 'totalNotValid'
}

export const validateTable = (values: ITableData): ITableData => {
  return {
    date: validateField('date', values.date),
    total: validateTotal(values.total),
    currency: validateField('currency', values.currency),
    invoice: values.invoice,
    clientID: validateField('clientID', values.clientID),
    status: values.status
  }
}

export const validTable = (values: ITableData) => {
  return !values.date && !values.clientID && !values.currency && !values.total
}