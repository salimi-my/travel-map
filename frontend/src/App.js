import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {
  MapPinIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import Register from './components/Register';
import Login from './components/Login';
import jwt_decode from 'jwt-decode';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = useState({
    latitude: 3.951435975804096,
    longitude: 108.197307592156,
    zoom: 6
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();

    if (myStorage.getItem('token')) {
      setCurrentUser(jwt_decode(myStorage.getItem('token')).username);
    }
  }, [myStorage, setCurrentUser]);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  };

  const handleDoubleClick = (e) => {
    if (!currentUser) return;
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !title || !desc) return;

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    };

    try {
      const res = await axios.post('/pins', newPin, {
        headers: { authorization: 'Bearer ' + myStorage.getItem('token') }
      });
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem('token');
    setCurrentUser(null);
  };

  const currentDate = new Date();
  let year = currentDate.getFullYear();

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      dragRotate={false}
      doubleClickZoom={false}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle='mapbox://styles/mapbox/streets-v12'
      onDblClick={handleDoubleClick}
    >
      {pins &&
        pins.map((pin) => (
          <div key={pin._id}>
            <Marker latitude={pin.lat} longitude={pin.long} anchor='bottom'>
              <MapPinIcon
                className={`w-8 h-auto cursor-pointer ${
                  pin.username === currentUser
                    ? 'text-blue-700'
                    : 'text-red-700'
                }`}
                onClick={() => {
                  handleMarkerClick(pin._id, pin.lat, pin.long);
                }}
              />
            </Marker>

            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                closeOnClick={false}
                onClose={() => {
                  setCurrentPlaceId(null);
                }}
                anchor='left'
              >
                <div className='w-64 h-full flex flex-col justify-around'>
                  <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                    Place
                  </label>
                  <h4 className='font-bold text-sm'>{pin.title}</h4>
                  <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                    Review
                  </label>
                  <p className='text-sm'>{pin.desc}</p>
                  <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                    Rating
                  </label>
                  <div className='flex'>
                    {[...Array(pin.rating)].map((_e, i) => (
                      <StarIcon key={i} className='w-6 h-6 text-yellow-400' />
                    ))}
                    {[...Array(5 - pin.rating)].map((_e, i) => (
                      <StarIconOutline
                        key={i}
                        className='w-6 h-6 text-yellow-400'
                      />
                    ))}
                  </div>
                  <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                    Information
                  </label>
                  <span className='text-sm'>
                    Created by{' '}
                    <b>{pin.username === currentUser ? 'you' : pin.username}</b>
                  </span>
                  <span className='text-xs'>
                    <Moment className='lowercase' fromNow ago>
                      {pin.createdAt}
                    </Moment>{' '}
                    ago
                  </span>
                </div>
              </Popup>
            )}
          </div>
        ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeOnClick={false}
          onClose={() => {
            setNewPlace(null);
          }}
          anchor='left'
        >
          <div className='w-64 h-full flex flex-col'>
            <form onSubmit={handleSubmit} className='flex flex-col h-64'>
              <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                Title
              </label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                className='border-b-[0.5px] border-gray-500 outline-none mt-1 mb-2'
                placeholder='Enter title'
              />
              <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                Review
              </label>
              <textarea
                onChange={(e) => setDesc(e.target.value)}
                className='border-b-[0.5px] border-gray-500 outline-none resize-none mt-1 mb-2'
                placeholder='How do like this place'
              />
              <label className='text-blue-500 text-sm border-b-[0.5px] border-blue-500 my-[3px] w-max'>
                Rating
              </label>
              <select
                onChange={(e) => setRating(e.target.value)}
                className='border-b-[0.5px] border-gray-500 outline-none mt-2 mb-8 pb-[2px]'
                defaultValue={'default'}
              >
                <option value='default' disabled>
                  Select rating
                </option>
                <option value='1'>1 Star</option>
                <option value='2'>2 Stars</option>
                <option value='3'>3 Stars</option>
                <option value='4'>4 Stars</option>
                <option value='5'>5 Stars</option>
              </select>
              <button
                type='submit'
                className='p-1 rounded-[4px] bg-blue-500 text-white font-semibold hover:opacity-80'
              >
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}
      <div className='flex space-x-2 fixed top-2 right-2'>
        {currentUser ? (
          <button
            onClick={handleLogout}
            className='flex items-center py-1 px-3 rounded-[4px] bg-red-500 text-white font-semibold hover:opacity-80 w-full shadow-md'
          >
            Logout
            <ArrowRightOnRectangleIcon className='h-3 ml-1' />
          </button>
        ) : (
          <div className='flex space-x-2'>
            <button
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
              className='flex items-center py-1 px-3 rounded-[4px] bg-blue-500 text-white font-semibold hover:opacity-80 w-full shadow-md'
            >
              <ArrowLeftOnRectangleIcon className='h-4 mr-1' />
              Login
            </button>
            <button
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
              className='flex items-center py-1 px-3 rounded-[4px] bg-green-500 text-white font-semibold hover:opacity-80 w-full shadow-md'
            >
              <PencilSquareIcon className='h-4 mr-1' />
              Register
            </button>
          </div>
        )}
      </div>
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
      <div className='hidden lg:block w-fit absolute bottom-0 right-0 left-0 px-2 mx-auto bg-[hsla(0,0%,100%,.5)] text-gray-500'>
        Travel Map App &copy; {year} Created by{' '}
        <a
          href='https://www.salimi.my'
          target='_blank'
          rel='noreferrer'
          className='hover:underline hover:text-black'
        >
          Mohamad Salimi
        </a>
      </div>
    </Map>
  );
}

export default App;
