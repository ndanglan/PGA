import React, { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import { filterProps } from '../../../models/tableModel'
import Button from '../../common/components/Button'
import { IFilters } from '../utils/commonFunction'
import Filter from './Filter'
interface Props {
  updatedFilter(type: string, values?: string, dateFrom?: number, dateTo?: number): void,
  resetData(): void
}

const TableHeader = (props: Props) => {
  return (
    <div>
      {/* Title and export csv */}
      <div className="d-flex align-items-center justify-content-between">
        <h2 style={{ color: '#29506f' }}>
          <FormattedMessage id="payrollList" />
        </h2>
        <Button styles={{
          backgroundColor: '#1da9df',
          color: "#fff"
        }}
          content="Export CSV" />
      </div>
      {/* filter */}
      <div>
        <Filter updatedFilter={props.updatedFilter} resetData={props.resetData} />
      </div>
    </div>
  )
}

export default memo(TableHeader)