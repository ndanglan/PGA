import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import Button from '../../common/components/Button';
import DatePicker from 'react-datepicker';
import '../../../scss/table/table.scss'
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
import { FormattedMessage, useIntl } from 'react-intl';
interface Props {
  updatedFilter(type: string, values?: string, dateFrom?: number, dateTo?: number): void,
  resetData(): void,
}

const CustomInput = forwardRef(function DateInput(props: any, ref: any) {
  return (
    <div>
      <input {...props} ref={ref} />
      <i className="fa-solid fa-calendar-days"></i>
    </div>
  )
})

const Filter = (props: Props) => {
  const intl = useIntl();
  const [date, setDate] = useState<{
    from: Date | null,
    to: Date | null
  }>({
    from: null,
    to: null,
  });
  const { data } = useSelector((state: AppState) => state.table);

  // filter by serverside
  const [formValues, setFormValues] = useState<{ status: string, client: string, from: Date | null, to: Date | null }>({
    status: '',
    client: '',
    from: null,
    to: null
  });

  // load các status hoặc client có trong data
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

  // render ra các option
  const renderFilter = (key: string) => {
    const keyArr = takeFieldArr(key);
    const renderArr: JSX.Element[] = []

    // render ra jsx
    renderArr.push(
      <option value={''} className="text-capitalize" key={0}>
        {intl.formatMessage({ id: key })}
      </option>,
    )
    keyArr.map((item) => {

      renderArr.push(
        <option value={item} key={item}>
          {item}
        </option>
      )
    })

    return renderArr;
  }

  useEffect(() => {
    // nếu cả date from và date to được chọn thì mới update filter vào hàm filter
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
            setFormValues((prev) => ({
              ...prev,
              status: e.target.value
            }))
            props.updatedFilter('status', e.target.value);
          }}
        >
          {data.length !== 0 && renderFilter('status')}
        </select>

        {/* Client */}
        <select className="form-select" style={{ maxWidth: "100px", color: '#888' }}
          onChange={(e) => {
            setFormValues((prev) => ({
              ...prev,
              client: e.target.value
            }))
            props.updatedFilter('clientID', e.target.value);
          }}
        >
          {data.length !== 0 && renderFilter('client')}
        </select>
        {/* Date */}
        <div>
          <DatePicker
            className="filter-field" placeholderText={intl.formatMessage({ id: "from" })}
            selected={date.from}
            onChange={(date) => {
              setDate((prev) => {
                return {
                  ...prev,
                  from: date
                }
              })
            }}
            customInput={<CustomInput />}
          />
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
            placeholderText={intl.formatMessage({ id: "to" })}
            customInput={<CustomInput />}
          />
        </div>

        {/* Invoice */}
        <input type="text" placeholder={intl.formatMessage({ id: "invoice" })} className="form-control" />
      </form>

      <div className="d-flex gap-3">
        <Button styles={{
          border: '2px solid #1da9df',
          color: "#1da9df"
        }}
          content={intl.formatMessage({ id: "apply" })}
        />
        <Button styles={{
          border: "2px solid #b80e52",
          color: "#b80e52"
        }} content={intl.formatMessage({ id: "clear" })} handleClick={() => {
          setFormValues({
            status: '',
            client: '',
            from: null,
            to: null
          })
          props.resetData()
        }} />
      </div>
    </div>
  )
}

export default Filter