import React, { useCallback, useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap'

type Props = {
  numberOfData: number,
  setPages: React.Dispatch<React.SetStateAction<number>>,
  pages: number
}

const TableFooter = (props: Props) => {
  const { numberOfData, setPages, pages } = props;
  const [pageItems, setPageItems] = useState<JSX.Element[]>();

  const showingData = useCallback(() => {
    const numberOfPage = Math.ceil(numberOfData / 10);
    const remainer = numberOfData % 10;

    if (numberOfPage > 1) {
      if (pages === Math.ceil(numberOfData / 10)) {
        return `Showing ${remainer} from ${numberOfData}`
      }

      return `Showing 10 from ${numberOfData}`
    }

    return `Showing ${numberOfData} from ${numberOfData}`
  }, [numberOfData, pages])

  const loadPages = () => {
    const items = [
      <Pagination.Item key="first" onClick={() => { setPages(1) }}>
        &laquo;
      </Pagination.Item>
    ];
    if (Math.ceil(numberOfData / 10) > 5) {
      if (pages === 1 || pages === 2) {

        for (let i = 0; i < 5; i++) {
          items.push(
            <Pagination.Item key={i + 1} active={pages === i + 1} onClick={() => { setPages(i + 1) }}>
              {i + 1}
            </Pagination.Item>
          )
        }
      } else if (pages >= 3 && pages < Math.ceil(numberOfData / 10) - 1) {
        for (let i = (pages - 3); i < (pages + 2); i++) {
          items.push(
            <Pagination.Item key={i + 1} active={pages === i + 1} onClick={() => { setPages(i + 1) }}>
              {i + 1}
            </Pagination.Item>
          )
        }
      } else if (pages === Math.ceil(numberOfData / 10) - 1 || pages === Math.ceil(numberOfData / 10)) {
        for (let i = Math.ceil(numberOfData / 10) - 5; i < Math.ceil(numberOfData / 10); i++) {
          items.push(
            <Pagination.Item key={i + 1} active={pages === i + 1} onClick={() => { setPages(i + 1) }}>
              {i + 1}
            </Pagination.Item>
          )
        }
      }
    } else {
      for (let i = 0; i < Math.ceil(numberOfData / 10); i++) {
        items.push(
          <Pagination.Item key={i + 1} active={pages === i + 1} onClick={() => { setPages(i + 1) }}>
            {i + 1}
          </Pagination.Item>
        )
      }
    }

    items.push(
      <Pagination.Item key="last" onClick={() => { setPages(Math.ceil(numberOfData / 10)) }}>
        &raquo;
      </Pagination.Item>
    )

    setPageItems(items)

  }

  useEffect(() => {
    loadPages();
  }, [numberOfData, pages])

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