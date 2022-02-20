import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../common/components/Button';
import DatePicker from 'react-datepicker';
import '../../../scss/table/table.scss'
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
interface Props {
  updatedFilter(type: string, values?: string, dateFrom?: number, dateTo?: number): void
}

const Filter = (props: Props) => {
  const [date, setDate] = useState<{
    from: Date | null,
    to: Date | null
  }>({
    from: null,
    to: null,
  });
  const { data } = useSelector((state: AppState) => state.table);

  // filter by serverside
  // const [formValues, setFormValues] = useState<{ status: string, client: string, from: string, to: string }>();

  const takeFieldArr = useCallback((key: string) => {
    const arr: string[] = [];
    // lấy key 
    switch (key) {
      case 'status':
        data.forEach(item => {
          if (!arr.includes(item.status)) {
            arr.push(item.status);
          }
        })
        break;
      case 'client':
        data.forEach(item => {
          if (!arr.includes(item.clientID)) {
            arr.push(item.clientID);
          }
        })
    }
    return arr
  }, [data])

  const renderFilter = useCallback((key: string) => {
    const keyArr = takeFieldArr(key);
    const renderArr: JSX.Element[] = []

    // render ra jsx
    renderArr.push(
      <option value={''} className="text-capitalize">
        {key}
      </option>,
    )
    keyArr.map((item) => {
      renderArr.push(
        <option value={item} key={item}>{item}</option>
      )
    })

    return renderArr;
  }, [takeFieldArr])

  useEffect(() => {
    if (date.from && date.to) {
      props.updatedFilter('date', '', date.from?.getTime(), date.to?.getTime())
    }
  }, [date])

  return (
    <div className="mt-3 d-flex justify-content-between
    ">
      <form className="d-flex gap-3">
        {/* Status */}
        <select
          className="form-select"
          style={{ maxWidth: "100px", color: '#888' }}
          onChange={(e) => {
            props.updatedFilter('status', e.target.value);
          }}
        >
          {data.length !== 0 && renderFilter('status')}
        </select>

        {/* Client */}
        <select className="form-select" style={{ maxWidth: "100px", color: '#888' }}
          onChange={(e) => {
            props.updatedFilter('clientID', e.target.value);
          }}
        >
          {data.length !== 0 && renderFilter('client')}
        </select>
        {/* Date */}
        <div>
          <DatePicker
            className="filter-field" placeholderText="From"
            selected={date.from}
            onChange={(date) => {
              setDate((prev) => {
                return {
                  ...prev,
                  from: date
                }
              })
            }} />
        </div>
        <div>
          <DatePicker
            className="filter-field"
            minDate={date.from}
            selected={date.to}
            onChange={(date) => {
              setDate((prev) => {
                return {
                  ...prev,
                  to: date
                }
              })
            }}
            placeholderText="To"
          />
        </div>

        {/* Invoice */}
        <input type="text" placeholder="Invoice" className="form-control" />
      </form>

      <div className="d-flex gap-3">
        <Button styles={{
          border: '2px solid #1da9df',
          color: "#1da9df"
        }}
          content="Apply"
        />
        <Button styles={{
          border: "2px solid #b80e52",
          color: "#b80e52"
        }} content="Clear" />
      </div>
    </div>
  )
}

export default Filter