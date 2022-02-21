import React, { useCallback, useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap'

type Props = {
  numberOfData: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  currentPage: number
}

const TableFooter = (props: Props) => {
  const { numberOfData, setCurrentPage, currentPage } = props;
  const [pageItems, setPageItems] = useState<JSX.Element[]>();

  const showingData = useCallback(() => {
    const numberOfPage = Math.ceil(numberOfData / 10);
    const remainer = numberOfData % 10;

    if (numberOfPage > 1) {
      if (currentPage === Math.ceil(numberOfData / 10)) {
        return `Showing ${remainer} from ${numberOfData}`
      }

      return `Showing 10 from ${numberOfData}`
    }

    return `Showing ${numberOfData} from ${numberOfData}`
  }, [numberOfData, currentPage])

  const loadPages = () => {
    const items = [
      <Pagination.Item key="first" onClick={() => { setCurrentPage(1) }}>
        &laquo;
      </Pagination.Item>
    ];
    if (Math.ceil(numberOfData / 10) > 5) {
      if (currentPage === 1 || currentPage === 2) {

        for (let i = 0; i < 5; i++) {
          items.push(
            <Pagination.Item key={i + 1} active={currentPage === i + 1} onClick={() => { setCurrentPage(i + 1) }}>
              {i + 1}
            </Pagination.Item>
          )
        }
      } else if (currentPage >= 3 && currentPage < Math.ceil(numberOfData / 10) - 1) {
        for (let i = (currentPage - 3); i < (currentPage + 2); i++) {
          items.push(
            <Pagination.Item key={i + 1} active={currentPage === i + 1} onClick={() => { setCurrentPage(i + 1) }}>
              {i + 1}
            </Pagination.Item>
          )
        }
      } else if (currentPage === Math.ceil(numberOfData / 10) - 1 || currentPage === Math.ceil(numberOfData / 10)) {
        for (let i = Math.ceil(numberOfData / 10) - 5; i < Math.ceil(numberOfData / 10); i++) {
          items.push(
            <Pagination.Item key={i + 1} active={currentPage === i + 1} onClick={() => { setCurrentPage(i + 1) }}>
              {i + 1}
            </Pagination.Item>
          )
        }
      }
    } else {
      for (let i = 0; i < Math.ceil(numberOfData / 10); i++) {
        items.push(
          <Pagination.Item key={i + 1} active={currentPage === i + 1} onClick={() => { setCurrentPage(i + 1) }}>
            {i + 1}
          </Pagination.Item>
        )
      }
    }

    items.push(
      <Pagination.Item key="last" onClick={() => { setCurrentPage(Math.ceil(numberOfData / 10)) }}>
        &raquo;
      </Pagination.Item>
    )

    setPageItems(items)

  }

  useEffect(() => {
    loadPages();
  }, [numberOfData, currentPage])

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <p className="my-auto" style={{ color: '#29506f', fontWeight: '600' }}>{showingData()}</p>
      </div>
      <div>
        <Pagination className="d-flex align-items-center justify-content-end">
          {pageItems}
        </Pagination>
      </div>
    </div>
  )
}

export default TableFooter