import React, { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '../../common/components/Button'
import Filter from './Filter'

const TableHeader = (props: any) => {
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
        <Filter />
      </div>
    </div>
  )
}

export default memo(TableHeader)