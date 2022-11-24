import { ArrowLeftOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useState, useRef } from 'react';
import axios from 'axios';

function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      nameRef.current.value === null ||
      nameRef.current.value === '' ||
      nameRef.current.value === undefined ||
      passwordRef.current.value === null ||
      passwordRef.current.value === '' ||
      passwordRef.current.value === undefined
    ) {
      setErrorMessage('Please fill in the blank');
      setError(true);
      setLoading(false);
      return;
    } else {
      setError(false);
    }

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };

    try {
      const res = await axios.post('/users/login', user);
      myStorage.setItem('token', res.data.accessToken);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
      setLoading(false);
      nameRef.current.value = '';
      passwordRef.current.value = '';
    } catch (err) {
      if (
        err.response.status === 400 &&
        err.response.data !== null &&
        err.response.data !== undefined
      ) {
        setErrorMessage(err.response.data);
      } else {
        setErrorMessage('Something wrong happened! Please try again.');
      }
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center w-80 h-64 p-5 rounded-md absolute bg-white top-0 bottom-0 left-0 right-0 m-auto shadow-md'>
      <div className='flex items-center text-base font-bold text-blue-500'>
        <ArrowLeftOnRectangleIcon className='w-5 h-auto cursor-pointer mr-1' />
        Login
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-full h-full justify-between mt-5'
      >
        <input
          ref={nameRef}
          className='border-b-[0.5px] text-sm border-gray-500 outline-none resize-none'
          type='text'
          placeholder='Username'
        />
        <input
          ref={passwordRef}
          className='border-b-[0.5px] text-sm border-gray-500 outline-none resize-none'
          type='password'
          placeholder='Password'
        />
        <button
          className='flex justify-center items-center py-2 px-3 rounded-[4px] bg-blue-500 text-white text-xs font-semibold hover:opacity-80 w-full'
          type='submit'
        >
          {loading && <Spinner />}
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <div className='flex justify-center relative'>
          {error && (
            <span className='flex text-center absolute bottom-1 text-red-700'>
              <ExclamationCircleIcon className='h-5 mr-1' />
              {errorMessage}
            </span>
          )}
        </div>
      </form>
      <div
        onClick={() => setShowLogin(false)}
        className='absolute top-0 right-0 w-max hover:bg-gray-100 p-[2px] m-1 rounded-md cursor-pointer group'
      >
        <XMarkIcon className='h-5 cursor-pointer text-gray-500 group-hover:text-black' />
      </div>
    </div>
  );
}

export default Login;

function Spinner() {
  return (
    <svg
      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  );
}
