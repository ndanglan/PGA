import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../redux/reducer'
import { FormattedMessage } from 'react-intl';
import { ThunkDispatch } from 'redux-thunk';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../config/api';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { Action } from 'typesafe-actions';
import { ILocationParams } from '../../../models/authModel';
import Loading from '../../common/components/Loading'
import { push } from 'connected-react-router';
import { ROUTES } from '../../../config/routes';
type Props = {}

const UserInfoPage = () => {
  const user = useSelector((state: AppState) => state.profile.user)
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [locations, setLocations] = useState<{
    region: ILocationParams,
    state: ILocationParams
  }>({
    region: {
      id: 0,
      name: '',
      pid: 0
    },
    state: {
      id: 0,
      name: '',
      pid: 0
    }
  });
  const [loading, setLoading] = useState(false);

  const getLocations = useCallback(async (id?: number) => {
    // điều kiện nếu có id thì gọi state và setState còn nếu không có id thì phải gọi region và setRegion
    setLoading(true);
    const json = await dispatch(fetchThunk(id !== 0 ? `${API_PATHS.location}?pid=${id}` : API_PATHS.location, 'get'));
    setLoading(false)
    if (json?.code === RESPONSE_STATUS_SUCCESS) {
      return json.data
    }
  }, [dispatch])

  // console.log(user);

  useEffect(() => {
    const takeLocation = async () => {
      const result = await Promise.all([getLocations(0), getLocations(user?.region)])
      // console.log(result);
      const region = result[0].find((item: ILocationParams) => item.id === user?.region);
      const state = result[1].find((item: ILocationParams) => item.id === user?.state)
      // console.log('state', state);
      // console.log('region', region);


      setLocations((prev) => {
        return {
          ...prev,
          region: region,
          state: state
        }
      })
    }

    takeLocation();
  }, [])

  console.log(locations);


  if (loading) {
    return <Loading />
  }

  return (
    <div className="d-flex align-items-center justify-content-center ">
      {user?.token && (
        <div className="container mt-5 p-5 shadow" style={{ maxWidth: '700px' }}>
          {user?.avatar ? (
            <div>
              {user?.avatar}
            </div>
          ) : (
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3" style={{
              width: '100px',
              height: '100px'
            }}>
              <p className="m-0" style={{ fontSize: '50px', fontWeight: 'bold' }}>
                {user?.name.charAt(0).toUpperCase()}
              </p>
            </div>
          )}

          {user?.description && (
            <div>
              {user?.description}
            </div>
          )}
          <div className="text-center mb-3">
            <h1>Thông tin cơ bản</h1>
          </div>
          <div className="row mb-3">
            <label className="col-3">
              <FormattedMessage id="email" />
            </label>
            <div className="col-9">
              {user?.email}
            </div>
          </div>
          {user.gender && (
            <div className="row mb-3">
              <label className="col-3">
                <FormattedMessage id="gender" />
              </label>
              <div className="col-9">
                <p className="m-0">
                  {user?.gender === '1' ? <FormattedMessage id="male" /> : <FormattedMessage id="female" />}
                </p>
              </div>
            </div>
          )}
          {user?.name && (
            <div className="row mb-3">
              <label className="col-3 ">
                <FormattedMessage id="name" />
              </label>
              <div className="col-9 text-capitalize">
                <p className="m-0">
                  {user?.name}
                </p>
              </div>
            </div>
          )}
          {locations.region.name && (
            <div className="row mb-3">
              <label className="col-3">
                <FormattedMessage id="region" />
              </label>
              <div className="col-9">
                {locations.region.name}
              </div>
            </div>
          )}
          {
            locations.state.name && (
              <div className="row mb-3">
                <label className="col-3">
                  <FormattedMessage id="state" />
                </label>
                <div className="col-9">
                  {locations.state.name}
                </div>
              </div>
            )
          }
          <div className="row">
            <button type="button" className="btn btn-primary mx-auto" style={{ width: 'fit-content' }} onClick={() => {
              dispatch(push(ROUTES.home))
            }}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserInfoPage