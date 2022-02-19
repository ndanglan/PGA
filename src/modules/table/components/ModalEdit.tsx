import React, { useEffect, useState, memo } from 'react'
import { Modal } from 'react-bootstrap'
import { ITableData } from '../../../models/tableModel'
import Button from '../../common/components/Button'
import { checkColor } from '../utils/commonFunction'

type Props = {
  show: boolean,
  handleClose(): void,
  handleConfirm(id: string, values?: ITableData): void,
  data: ITableData
}

const ModalEdit = (props: Props) => {
  const { show, handleClose, handleConfirm, data } = props;

  const [formValues, setFormValues] = useState<ITableData>({
    date: data.date,
    total: data.total,
    currency: data.currency,
    invoice: data.invoice,
    clientID: data.clientID,
    status: data.status
  })

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          Chi tiết giao dịch
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Status
            </label>
            <div className="col-sm d-flex align-items-center">
              <label style={{ color: checkColor(formValues.status) }}>
                {formValues.status}
              </label>
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Date
            </label>
            <div className="col-sm d-flex align-items-center">
              <input className="form-control" type="text" value={formValues.date} onChange={(e) => {
                setFormValues(prev => ({
                  ...prev,
                  date: e.target.value
                }))
              }} />
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Client
            </label>
            <div className="col-sm d-flex align-items-center">
              <input className="form-control" type="text" value={formValues.clientID}
                onChange={(e) => {
                  setFormValues(prev => ({
                    ...prev,
                    clientID: e.target.value
                  }))
                }} />
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Currency
            </label>
            <div className="col-sm d-flex align-items-center">
              <input className="form-control" type="text" value={formValues.currency}
                onChange={(e) => {
                  setFormValues(prev => ({
                    ...prev,
                    currency: e.target.value
                  }))
                }} />
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Total
            </label>
            <div className="col-sm d-flex align-items-center">
              <input className="form-control" type="text" value={formValues.total} onChange={(e) => setFormValues(prev => ({
                ...prev,
                total: e.target.value
              }))} />
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Invoice
            </label>
            <div className="col-sm d-flex align-items-center">
              <label >
                {formValues.invoice}
              </label>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          content="Close"
          handleClick={handleClose}
          styles={{ color: '#b80e52', borderColor: "#b80e52" }} />
        <Button
          content="Confirm"
          styles={{ color: '#29506f', borderColor: "#29506f" }}
          handleClick={() => {
            handleConfirm(data.invoice, formValues)
          }} />
      </Modal.Footer>
    </Modal>
  )
}

export default memo(ModalEdit)