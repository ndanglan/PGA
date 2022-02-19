import React, { useState } from 'react'
import Button from '../../common/components/Button';
import DatePicker from 'react-datepicker';
import '../../../scss/table/table.scss'

type Props = {}

const Filter = (props: Props) => {
  const [startDate, setStartDate] = useState();
  return (
    <div className="mt-3 d-flex justify-content-between
    ">
      <form className="d-flex gap-3">
        {/* Status */}
        <select className="form-select" style={{ maxWidth: "100px", color: '#888' }}>
          <option selected disabled>Status</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>

        {/* Client */}
        <select className="form-select" style={{ maxWidth: "100px", color: '#888' }}>
          <option selected disabled>Client</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
        {/* Date */}
        <DatePicker className="filter-field" placeholderText="From" onChange={(date) => {
          console.log(date);
        }} />
        <DatePicker className="filter-field" onChange={() => { }} placeholderText="To" />

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