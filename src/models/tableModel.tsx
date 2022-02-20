export interface ITableData {
  date: string,
  total: string,
  currency: string,
  invoice: string,
  clientID: string,
  status: string
}

export interface filterProps {
  active: boolean,
  keys: {
    // status?: (value: any) => boolean,
    // client?: (value: any) => boolean,
  }
}