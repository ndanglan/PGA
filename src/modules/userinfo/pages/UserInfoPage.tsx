import React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../../redux/reducer'

type Props = {}

const UserInfoPage = () => {
  const user = useSelector((state: AppState) => state.profile.user)
  console.log(user);

  return (
    <div>
      <div>
        {user?.avatar}
      </div>
      <div>
        {user?.description}
      </div>
      <div>
        {user?.email}
      </div>
      <div>
        {user?.gender}
      </div>
      <div>
        {user?.name}
      </div>
      <div>
        {user?.region}
      </div>
      <div>
        {user?.state}
      </div>
    </div>
  )
}

export default UserInfoPage