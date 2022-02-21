import React, { memo } from 'react'
import { Dropdown } from 'react-bootstrap'
import { ITableData, sortingProps } from '../../../models/tableModel'
import '../../../scss/table/table.scss'
import DataRow from './DataRow'


type Props = {
  data?: ITableData[],
  currentPages: number,
  onDelete(values: {
    show: boolean,
    content: string,
    payload: {
      id: string,
      data: ITableData
    }
  }): void,
  onEdit(obj: {
    show: boolean,
    title: string,
    id: string
  }): void,
  updatedFilter(type: string, values?: string, dateFrom?: number, dateTo?: number): void,
  onSorting: React.Dispatch<React.SetStateAction<sortingProps>>
}

const CustomToggle = React.forwardRef(function customToggle(props: any, ref: any) {
  return (
    <>
      <p
        {...props}
        href="#_"
        ref={ref}
        className="m-0 text-decoration-none"
        style={{ color: '#29506f' }}
      >
        {props.children}
      </p>
      <i className="fa-solid fa-caret-down d-flex align-items-center ms-2"></i>
    </>
  )
});

const TableContent = (props: Props) => {

  const { data, onDelete, onEdit, currentPages, onSorting } = props;

  return (
    <div className="mt-3">
      <table className="table table-borderless" style={{ borderCollapse: "separate", borderSpacing: '0 15px' }}>
        <thead>
          <tr style={{ border: 'none' }}>
            <th scope="col" style={{ color: "#29506f" }}>Status</th>
            <th scope="col" style={{ color: "#29506f" }} className="d-flex align-items-center justify-content-start">
              <Dropdown className="d-flex" style={{ cursor: 'pointer' }}>
                <Dropdown.Toggle as={CustomToggle} id="dropdown">
                  Date
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    eventKey="ascending"
                    onClick={() => {
                      onSorting(prev => ({
                        ...prev,
                        type: 'ascending',
                        key: 'date',
                        active: true
                      }))
                    }}
                  >
                    Ascending
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="descending"
                    onClick={() => {
                      onSorting(prev => ({
                        ...prev,
                        type: 'descending',
                        key: 'date',
                        active: true
                      }))
                    }}>
                    Descending
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </th>
            <th scope="col" style={{ color: "#29506f" }}>Client</th>
            <th scope="col" style={{ color: "#29506f" }}>Currency</th>
            <th scope="col" style={{ color: "#29506f" }} className="d-flex align-items-center justify-content-start">
              <Dropdown className="d-flex" style={{ cursor: 'pointer' }}>
                <Dropdown.Toggle as={CustomToggle} id="dropdown">
                  Total
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="ascending"
                    onClick={() => {
                      onSorting(prev => ({
                        ...prev,
                        type: 'ascending',
                        key: 'total',
                        active: true
                      }))
                    }}>
                    Ascending
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="descending"
                    onClick={() => {
                      onSorting(prev => ({
                        ...prev,
                        type: 'descending',
                        key: 'total',
                        active: true
                      }))
                    }}>
                    Descending
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </th>
            <th scope="col" style={{ color: "#29506f" }}>Invoice #</th>
          </tr>
        </thead>
        <tbody className="gap-3">
          {data?.map((item, index) => {
            if (index >= (currentPages - 1) * 10 && index < currentPages * 10) {
              return (
                <DataRow key={item.invoice} item={item} onEdit={onEdit} onDelete={onDelete} />
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}

export default memo(TableContent)