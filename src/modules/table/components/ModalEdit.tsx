import React, { useEffect, useState, memo } from 'react'
import { Modal } from 'react-bootstrap'
import { ITableData } from '../../../models/tableModel'
import Button from '../../common/components/Button'
import { AppState } from '../../../redux/reducer'
import { useSelector } from 'react-redux'
import { validateTable, validTable, checkColor } from '../utils'

type Props = {
  show: boolean,
  id: string,
  title: string,
  handleClose(): void,
  handleConfirm(id: string, values?: ITableData): void,
}

const ModalEdit = (props: Props) => {
  const { show, id, title, handleClose, handleConfirm } = props;
  const { data } = useSelector((state: AppState) => state.table)

  const [formValues, setFormValues] = useState<ITableData>({
    date: '',
    total: '',
    currency: '',
    invoice: '',
    clientID: '',
    status: ''
  })

  const [validate, setValidate] = useState<ITableData>({
    date: '',
    total: '',
    currency: '',
    invoice: '',
    clientID: '',
    status: ''
  })

  const onConfirm = (values: ITableData) => {
    const validObj = validateTable(values);
    setValidate(validObj);
    console.log(validObj);

    if (!validTable(validObj)) {
      console.log(validTable(validObj));

      return;
    }

    handleConfirm(id, values)
  }

  useEffect(() => {
    setFormValues((prev) => {
      const dataObj = data.find(item => item.invoice === id);
      return {
        ...prev,
        ...dataObj
      }
    })
  }, [])

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
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
            <div className="col-sm">
              <input className="form-control form-control my-auto w-100" type="text" value={formValues.date} onChange={(e) => {
                setFormValues(prev => ({
                  ...prev,
                  date: e.target.value
                }))
              }} />
              {!!validate.date && (
                <small className="text-danger">
                  {validate.date}
                </small>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Client
            </label>
            <div className="col-sm">
              <input className="form-control form-control my-auto w-100" type="text" value={formValues.clientID}
                onChange={(e) => {
                  setFormValues(prev => ({
                    ...prev,
                    clientID: e.target.value
                  }))
                }} />
              {!!validate.clientID && (
                <small className="text-danger">
                  {validate.clientID}
                </small>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Currency
            </label>
            <div className="col-sm">
              <input className="form-control form-control my-auto w-100" type="text" value={formValues.currency}
                onChange={(e) => {
                  setFormValues(prev => ({
                    ...prev,
                    currency: e.target.value
                  }))
                }} />
              {!!validate.currency && (
                <small className="text-danger">
                  {validate.currency}
                </small>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">
              Total
            </label>
            <div className="col-sm ">
              <input className="form-control my-auto w-100" type="text" value={formValues.total} onChange={(e) => setFormValues(prev => ({
                ...prev,
                total: e.target.value
              }))} />
              {!!validate.total && (
                <small className="text-danger">
                  {validate.total}
                </small>
              )}
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
            onConfirm(formValues)
          }} />
      </Modal.Footer>
    </Modal>
  )
}

export default memo(ModalEdit)