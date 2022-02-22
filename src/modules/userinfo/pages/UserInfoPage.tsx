import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../redux/reducer'
import { FormattedMessage } from 'react-intl';
import { ThunkDispatch } from 'redux-thunk';
import ReactCrop from 'react-image-crop'
import { push } from 'connected-react-router';
import axios from 'axios';

import { Button, Modal } from 'react-bootstrap';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../config/api';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { Action } from 'typesafe-actions';
import { ILocationParams } from '../../../models/authModel';
import Loading from '../../common/components/Loading'
import { ROUTES } from '../../../config/routes';
import { ACCESS_TOKEN_KEY, BASE_URL } from '../../../utils/constants';
import "../../../scss/userInfo/userInfo.scss"
import { Crops } from '../../../models/imgModel';
import 'react-image-crop/dist/ReactCrop.css'
import { generateUrlBlob } from '../utils';
import Cookies from 'js-cookie';

const UserInfoPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const user = useSelector((state: AppState) => state.profile.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<any>(null);
  const previewCanvasRef = useRef<any>(null);
  const [previewImg, setPreviewImg] = useState('');
  const [crops, setCrops] = useState<any>({
    unit: '%',
    width: 30,
    aspect: 1
  })
  const [completedCrop, setCompletedCrop] = useState<Crops>();
  const [modalShow, setModalShow] = useState(false);
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


  const handleClose = () => setModalShow(false);
  const handleOpen = () => setModalShow(true);

  const handleUserImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    //check nếu đã nhập file 
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setPreviewImg(reader.result as any));
      reader.readAsDataURL(e.target.files[0]);
      handleOpen();
    }
  }

  // 
  const onUploadImg = async () => {
    // chuyển từ propertise của canvas về file
    const file = await generateUrlBlob(previewCanvasRef.current, completedCrop);

    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      console.log(formData);

      const json = await axios.put(API_PATHS.userProfile, formData, {
        headers: {
          'content-type': 'multipart/form-data; boundary=<calculated when request is sent>',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      })

      console.log(json);

    }

  }
  // lấy ra element img khi preview được ảnh
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    // example git hub react-image-crop
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop])

  const getLocations = useCallback(async (id?: number) => {
    // điều kiện nếu có id thì gọi state và setState còn nếu không có id thì phải gọi region và setRegion
    setLoading(true);
    const json = await dispatch(fetchThunk(id !== 0 ? `${API_PATHS.location}?pid=${id}` : API_PATHS.location, 'get'));
    setLoading(false)
    if (json?.code === RESPONSE_STATUS_SUCCESS) {
      return json.data
    }
  }, [dispatch])

  useEffect(() => {
    const takeLocation = async () => {
      // promise all để call api lấy tên của quốc gia và thành phố
      const result = await Promise.all([getLocations(0), getLocations(user?.region)])

      const region = result[0].find((item: ILocationParams) => item.id === user?.region);
      const state = result[1].find((item: ILocationParams) => item.id === user?.state)

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

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center ">
        {user?.token && (
          <div className="container mt-5 p-5 shadow" style={{ maxWidth: '700px' }}>
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3 user-img"
              style={{
                width: '100px',
                height: '100px',
                overflow: 'hidden'
              }}
              onClick={() => {
                fileRef.current?.click();
              }}
            >
              {user?.avatar ? (
                <img
                  src={`${BASE_URL}${user?.avatar}`}
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                <p className="m-0" style={{ fontSize: '50px', fontWeight: 'bold' }}>
                  {user?.name.charAt(0).toUpperCase()}
                </p>
              )}
              {/* input file */}
              <input type="file" hidden ref={fileRef} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUserImgChange(e)} />
            </div>

            {user?.description && (
              <div>
                {user?.description}
              </div>
            )}
            <div className="text-center mb-3">
              <h1>
                <FormattedMessage id="detailInfo" />
              </h1>
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
                <FormattedMessage id="backTohome" />
              </button>
            </div>
          </div>
        )}
      </div>
      {modalShow && (
        <Modal show={modalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage id="changeImg" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <div>
              <ReactCrop
                // className="crop-img"
                crop={crops}
                src={previewImg}
                onChange={(crops) => {
                  setCrops(crops)
                }}
                onImageLoaded={onLoad}
                onComplete={(c) => setCompletedCrop(c)}
              />
            </div>
            <div>
              <canvas ref={previewCanvasRef} style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              <FormattedMessage id="close" />
            </Button>
            <Button variant="primary" onClick={() => {
              handleClose()
              onUploadImg()
            }}>
              <FormattedMessage id="save" />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default UserInfoPage