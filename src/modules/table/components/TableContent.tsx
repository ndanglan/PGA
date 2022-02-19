import React, { memo } from 'react'
import { ITableData } from '../../../models/tableModel'
import '../../../scss/table/table.scss'
import DataRow from './DataRow'


type Props = {
  data?: ITableData[],
  onDelete(values: {
    show: boolean,
    content: string,
    payload: {
      id: string,
      data: ITableData
    }
  }): void,
  onEdit(obj: {
    show: boolean, content: {
      date: string,
      total: string,
      currency: string,
      invoice: string,
      clientID: string,
      status: string
    }, id: string
  }): void
}

const TableContent = (props: Props) => {

  const { data, onDelete, onEdit } = props;

  return (
    <div className="mt-3">
      <table className="table table-borderless" style={{ borderCollapse: "separate", borderSpacing: '0 15px' }}>
        <thead>
          <tr style={{ border: 'none' }}>
            <th scope="col" style={{ color: "#29506f" }}>Status</th>
            <th scope="col" style={{ color: "#29506f" }}>Date</th>
            <th scope="col" style={{ color: "#29506f" }}>Client</th>
            <th scope="col" style={{ color: "#29506f" }}>Currency</th>
            <th scope="col" style={{ color: "#29506f" }}>Total</th>
            <th scope="col" style={{ color: "#29506f" }}>Invoice #</th>
          </tr>
        </thead>
        <tbody className="gap-3">
          {data?.map((item) => (
            <DataRow key={item.invoice} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(TableContent)