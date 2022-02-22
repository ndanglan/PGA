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
import { filterProps, ITableData, sortingProps } from '../../../models/tableModel'
import ConfirmPopup from '../components/ConfirmPopup'
import ModalEdit from '../components/ModalEdit'
import { checkStatus, convertToTime, filterArray, formatTime } from '../utils/commonFunction'
import TableFooter from '../components/TableFooter'

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
  // lấy data từ store 
  const { data } = useSelector((state: AppState) => state.table)
  // state của data cho vào table
  const [valueTable, setValueTable] = useState<ITableData[]>(data);
  // state current page 
  const [currentPage, setCurrentPage] = useState<number>(1);
  // state để filters data propertises filters chứa các hàm để filter 
  const [filters, setFilters] = useState<filterProps>({
    active: false,
    filters: {
    }
  });
  // state để sorting data type là kiểu ascen hoặc descen, key là sorting theo cái props nào  ( date, total)
  const [sortings, setSortings] = useState<sortingProps>({
    active: false,
    type: '',
    key: ''
  })
  // state để mở confirm modal payload dùng khi confirm sau khi edit
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
  // state để mở edit modal 
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

  // sorting 
  // xử lí sort ascen theo date hoặc total 
  const handleSortingAscending = (data: ITableData[], key: string) => {
    let newArr = [];
    if (key === 'date') {
      newArr = data.sort((a, b) => convertToTime(a.date) - convertToTime(b.date));
      return newArr;
    }

    if (key === 'total') {
      newArr = data.sort((a, b) => (+a.total) - (+b.total))
      return newArr;
    }

    return data
  }

  // xử lí sort descen theo date hoặc total 
  const handleSortingDescending = (data: ITableData[], key: string) => {
    let newArr = [];
    if (key === 'date') {
      newArr = data.sort((a, b) => convertToTime(b.date) - convertToTime(a.date));
      return newArr;
    }

    if (key === 'total') {
      newArr = data.sort((a, b) => (+b.total) - (+a.total))
      return newArr;
    }

    return data
  }

  // update filter 
  const handleFilter = (data: ITableData[], filters: any) => {

    const newArr = filterArray(data, filters).map(item => {
      return {
        date: item['date'],
        total: item['total'],
        currency: item['currency'],
        invoice: item['invoice'],
        clientID: item['clientID'],
        status: item['status'],
      }
    })

    return newArr;
  }
  // xét hàm vào filters để filter bằng các hàm đó 
  const updatedFilter = (type: string, values?: string, dateFrom?: number, dateTo?: number) => {

    let filterObj = {};
    let newArr = [];

    setCurrentPage(1);

    if (type === 'reset') {
      // truyền type reset thì xóa các hàm filters rồi xét data lại về data trong store
      setFilters({
        active: true,
        filters: {},
      })
      setValueTable(data)
      return;
    }

    if (type === 'date') {
      // add thêm vào obj các filters trong state hiện tại + thêm cái muốn cho vào ngay bây giờ 
      filterObj = {
        ...filters.filters,
        [`${type}`]: (test: string) => test === values
      };

      // filters theo obj mới
      newArr = handleFilter(data, filterObj);
      setValueTable(newArr)
      // xét state filters cũ thành cái mới để lặp cho lần sau 
      setFilters((prev: filterProps) => {
        return {
          ...prev,
          active: true,
          filters: {
            ...prev.filters,
            [`${type}`]: (test: string) => {
              if (dateFrom && dateTo) {
                return convertToTime(test) >= dateFrom && convertToTime(test) <= dateTo
              }
            }
          }
        }
      })

      return;
    }
    // add thêm vào obj các filters trong state hiện tại + thêm cái muốn cho vào ngay bây giờ 
    filterObj = {
      ...filters.filters,
      [`${type}`]: (test: string) => test === values
    };
    // filters theo obj mới
    newArr = handleFilter(data, filterObj);
    setValueTable(newArr)
    // xét state filters cũ thành cái mới để lặp cho lần sau 
    setFilters((prev: filterProps) => {
      return {
        ...prev,
        active: true,
        filters: {
          ...prev.filters,
          [`${type}`]: (test: string) => test === values
        }
      }
    })
  }

  // reset filters
  const resetData = () => {
    updatedFilter('reset');
    setSortings({
      active: true,
      type: 'reset',
      key: ''
    })
  }

  // confirm function 
  const onConfirm = (id: string, values?: ITableData) => {
    // nếu values truyền vào không có id của đơn hàng thì xóa 
    if (!values?.invoice) {
      // tạo mảng mới sau khi xóa
      const newArr = data.filter((item: ITableData) => {
        return item.invoice !== id
      })

      // truyền lên redux
      dispatch(setTableData(newArr))
      // sau khi truyền mảng mới vào redux thì xét xem có đang ở trạng thái filter nào không nếu có thì filter rồi mới set vào state mới
      if (Object.keys(filters.filters).length > 0) {
        // nếu data đang hiển thị là ở trạng thái filters thì xóa ở cái data đó luôn tránh render lại lần nữa
        setValueTable((prev: ITableData[]) => {
          return prev.filter(item => item.invoice !== id);
        })

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
    // tìm đến chỉ số của đối tượng có trùng id 
    const existIndex = data.findIndex(item => item.invoice === id);
    // xét lại với mảng mới
    data[existIndex] = { ...values };
    const newArr = [...data]
    // truyền vào store
    dispatch(setTableData(newArr));
    // nếu đang filter thì filter rồi mới xét lại vào state
    if (Object.keys(filters.filters).length > 0) {
      // nếu đang filter thì update ở cái mảng đang hiển thị để tránh render
      setValueTable((prev: ITableData[]) => {
        const existIndex = prev.findIndex(item => item.invoice === id);

        prev[existIndex] = { ...values }
        const newArr = [...prev];

        return newArr;
      })

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
        total: (item.volume_input_in_input_currency + item.fees).toString()
      }
    })

    dispatch(setTableData(newArr))
    setValueTable(newArr)
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // useEffect(() => {
  //   if (sortings.active && sortings.type === 'ascending') {
  //     // khi sorting được active và type = ascending thì sort state đang hiển thị 

  //     const newArr = handleSortingAscending(valueTable, sortings.key);

  //     setValueTable([...newArr])
  //     return;
  //   }

  //   if (sortings.active && sortings.type === 'descending') {
  //     // tương tự với descen
  //     const newArr = handleSortingDescending(valueTable, sortings.key)
  //     setValueTable([...newArr])
  //     return;
  //   }

  //   if (sortings.type === 'reset') {
  //     setValueTable(data);
  //   }
  // }, [sortings.key, sortings.type])

  return (
    <>
      <div style={{ backgroundColor: '#f6f7fb' }}>
        <div className="container p-3">
          <TableHeader
            updatedFilter={updatedFilter}
            resetData={resetData}
            valueTable={valueTable} />
          <TableContent
            data={valueTable}
            currentPages={currentPage}
            onDelete={setShowModalConfirm}
            onEdit={setShowModalEdit}
            onSorting={setSortings}
          />
          <TableFooter
            numberOfData={valueTable.length} setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
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