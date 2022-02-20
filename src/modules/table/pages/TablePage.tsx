import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { AppState } from '../../../redux/reducer'
// import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode'
import TableContent from '../components/TableContent'
import TableHeader from '../components/TableHeader'
import { setTableData } from '../redux/tableReducer'
import { LIST_PAYROLL } from '../../../assets/data/mock_data';
import { filterProps, ITableData } from '../../../models/tableModel'
import ConfirmPopup from '../components/ConfirmPopup'
import ModalEdit from '../components/ModalEdit'
import { checkStatus, convertToTime, filterArray, formatTime } from '../utils/commonFunction'

const mockNameClient = [
  'Yopmall',
  'PowerGate',
  'AVB',
  'ADIDAS',
  'HSJKA',
  'QIYW'
]

const TablePage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  // const [loading, setLoading] = useState(false);
  const { data } = useSelector((state: AppState) => state.table)
  const [valueTable, setValueTable] = useState<ITableData[]>(data);
  const [filters, setFilters] = useState<filterProps>({
    active: false,
    keys: {
    }
  })
  const [showModalConfirm, setShowModalConfirm] = useState<{
    show: boolean,
    content: string,
    payload: {
      id: string,
      data: ITableData
    }
  }>({
    show: false,
    content: '',
    payload: {
      id: '',
      data: {
        date: '',
        total: '0',
        currency: '',
        invoice: '',
        clientID: '',
        status: ''
      }
    },
  });
  const [showModalEdit, setShowModalEdit] = useState<{
    show: boolean,
    title: string,
    id: string,
  }>({
    show: false,
    title: '',
    id: ''
  })

  // chưa có url backend -dùng mockdata
  // const fetchDataTable = useCallback(
  //   async () => {
  //     setLoading(true);

  //     const json = await dispatch(async (dispatch, getState) => {
  //       const res = await fetch('url');
  //       const resData = await res.json();

  //       return resData
  //     })

  //     setLoading(false);

  //     if (json.code === RESPONSE_STATUS_SUCCESS) {
  //       dispatch(setTableData(json.data))
  //     }
  //   }, [])

  // update filter 
  const updatedFilter = useCallback((type: string, values?: string, dateFrom?: number, dateTo?: number) => {
    if (type === 'status') {
      setFilters((prev: filterProps) => {
        return {
          ...prev,
          active: true,
          keys: {
            ...prev.keys,
            status: (test: string) => test === values
          }
        }
      })
      return;
    }

    if (type === 'clientID') {
      setFilters((prev: filterProps) => {
        return {
          ...prev,
          active: true,
          keys: {
            ...prev.keys,
            clientID: (test: string) => test === values
          }
        }
      })
    }

    if (type === 'date') {
      setFilters((prev: filterProps) => {
        return {
          ...prev,
          active: true,
          keys: {
            ...prev.keys,
            date: (test: string) => {
              if (dateFrom && dateTo) {
                return convertToTime(test) >= dateFrom && convertToTime(test) <= dateTo
              }
            }
          }
        }
      })
    }
  }, [])

  // confirm function 
  const onConfirm = (id: string, values?: ITableData) => {
    if (!values?.invoice) {

      const newArr = data.filter((item: ITableData) => {
        return item.invoice !== id
      })

      dispatch(setTableData(newArr))
      setValueTable(newArr);

      setShowModalConfirm({
        show: false,
        content: '',
        payload: {
          id: '',
          data: {
            date: '',
            total: '0',
            currency: '',
            invoice: '',
            clientID: '',
            status: ''
          }
        },
      })
      return;
    }

    const existIndex = data.findIndex(item => item.invoice === id);
    data[existIndex] = { ...values };
    const newArr = [...data]

    dispatch(setTableData(newArr))
    setValueTable(newArr);

    setShowModalConfirm({
      show: false,
      content: '',
      payload: {
        id: '',
        data: {
          date: '',
          total: '0',
          currency: '',
          invoice: '',
          clientID: '',
          status: ''
        }
      },
    })
  }

  // mock data
  const fetchData = useCallback(() => {
    const newArr = LIST_PAYROLL.payrolls.map((item) => {
      return {
        date: formatTime(item.time_created),
        status: checkStatus(item.date_processed, item.date_fulfilled, item.date_received),
        clientID: mockNameClient[Math.floor(Math.random() * mockNameClient.length)],
        invoice: item.payroll_id,
        currency: item.currency,
        total: item.volume_input_in_input_currency.toString()
      }
    })
    dispatch(setTableData(newArr))
    setValueTable(newArr)
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (filters.active) {
      const newArr = filterArray(data, filters.keys).map(item => {
        return {
          date: item['date'],
          total: item['total'],
          currency: item['currency'],
          invoice: item['invoice'],
          clientID: item['clientID'],
          status: item['status'],
        }
      })

      setValueTable(newArr)
    }
  }, [filters, data])

  return (
    <>
      <div style={{ width: '100vw', backgroundColor: '#f6f7fb' }}>
        <div className="container p-3">
          <TableHeader updatedFilter={updatedFilter} />
          <TableContent data={valueTable} onDelete={setShowModalConfirm} onEdit={setShowModalEdit} />
        </div>
      </div>
      {showModalEdit.show && (
        <ModalEdit
          {...showModalEdit}
          handleClose={() => {
            setShowModalEdit({
              show: false,
              title: '',
              id: ''
            })
          }}

          handleConfirm={(id: string, data: ITableData) => {
            setShowModalConfirm({
              show: true,
              content: 'Are you sure to update this information',
              payload: {
                id: id,
                data: {
                  date: data.date,
                  total: data.total,
                  currency: data.currency,
                  invoice: data.invoice,
                  clientID: data.clientID,
                  status: data.status
                }
              }
            })

            setShowModalEdit((prev) => ({
              ...prev,
              show: false,
              title: '',
              id: ''
            }))
          }}
        />
      )}
      {showModalConfirm.show && (
        <ConfirmPopup
          show={showModalConfirm.show}
          payload={showModalConfirm.payload}
          handleClose={() => {
            setShowModalConfirm({
              show: false,
              content: '',
              payload: {
                id: '',
                data: {
                  date: '',
                  total: '',
                  currency: '',
                  invoice: '',
                  clientID: '',
                  status: ''
                }
              }
            })
          }}
          handleConfirm={onConfirm}
        >
          {showModalConfirm.content}
        </ConfirmPopup>
      )}
    </>
  )
}

export default TablePage