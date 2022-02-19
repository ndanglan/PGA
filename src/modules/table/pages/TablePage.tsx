import React, { useCallback, useState, useEffect, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'typesafe-actions'
import { AppState } from '../../../redux/reducer'
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode'
import TableContent from '../components/TableContent'
import TableHeader from '../components/TableHeader'
import { setTableData } from '../redux/tableReducer'
import { LIST_PAYROLL } from '../../../assets/data/mock_data';
import { ITableData } from '../../../models/tableModel'
import { FULFILLED_CODE, PENDING_CODE, PROCESSING_CODE, RECEIVED_CODE } from '../utils/constants'
import ConfirmPopup from '../components/ConfirmPopup'
import ModalEdit from '../components/ModalEdit'
import moment from 'moment'

const TablePage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState(false);
  const { data } = useSelector((state: AppState) => state.table)
  const [valueTable, setValueTable] = useState<ITableData[]>(data);
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
    content: ITableData,
    id: string,
  }>({
    show: false,
    content: {
      date: '',
      total: '0',
      currency: '',
      invoice: '',
      clientID: '',
      status: ''
    },
    id: ''
  })
  // chưa có url backend -dùng mockdata
  const fetchDataTable = useCallback(
    async () => {
      setLoading(true);

      const json = await dispatch(async (dispatch, getState) => {
        const res = await fetch('url');
        const resData = await res.json();

        return resData
      })

      setLoading(false);

      if (json.code === RESPONSE_STATUS_SUCCESS) {
        dispatch(setTableData(json.data))
      }
    }, [])

  // function delete theo id của invoice
  const onConfirm = useCallback((id: string, values?: ITableData) => {
    if (!values?.invoice) {

      setValueTable((prev) => {
        const newArr = prev.filter((item: ITableData) => {
          return item.invoice !== id
        })
        return newArr
      });

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

    setValueTable((prev) => {
      const existIndex = prev.findIndex(item => item.invoice === id);
      prev[existIndex] = { ...values };
      const newArr = [...prev]

      return newArr
    });

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
  }, [valueTable, dispatch])

  // check status của 1 row
  const checkStatus = (process: string | null, fulfill: string | null, receive: string | null) => {
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

  // mock data
  const fetchData = useCallback(() => {
    const newArr = LIST_PAYROLL.payrolls.map((item) => {
      return {
        date: moment(item.time_created).format('DD MMM YY'),
        status: checkStatus(item.date_processed, item.date_fulfilled, item.date_received),
        clientID: item.company_id,
        invoice: item.payroll_id,
        currency: item.currency,
        total: item.volume_input_in_input_currency.toString()
      }
    })

    setValueTable(newArr)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    dispatch(setTableData(valueTable))
  }, [valueTable, dispatch])

  return (
    <>
      <div style={{ width: '100vw', backgroundColor: '#f6f7fb' }}>
        <div className="container p-3">
          <TableHeader />
          <TableContent data={valueTable} onDelete={setShowModalConfirm} onEdit={setShowModalEdit} />
        </div>
      </div>
      {showModalEdit.show && (
        <ModalEdit
          show={showModalEdit.show}
          handleClose={() => {
            setShowModalEdit({
              show: false,
              content: {
                date: '',
                total: '',
                currency: '',
                invoice: '',
                clientID: '',
                status: ''
              },
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
              content: {
                date: '',
                total: '0',
                currency: '',
                invoice: '',
                clientID: '',
                status: ''
              },
              id: ''
            }))
          }}
          data={showModalEdit.content}
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