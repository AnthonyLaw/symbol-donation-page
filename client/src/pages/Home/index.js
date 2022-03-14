import './Home.scss';
import React, { useState, useEffect } from 'react';
import Form from '../../components/Form';
import Table from '../../components/Table';
import TwitterSignIn from '../../components/TwitterSignIn';

const Home = function () {
  const [twitterAccountStatus, setTwitterAccountStatus] = useState({
		isVerify: false,
		screenName: ''
	});

  const [walletAddress, setWalletAddress] = useState({
    nemAddress: '',
    symbolAddress: ''
  })

  const [users, setUsers] = useState({
    data: [],
    success: false,
  });

  const [updateStatus, setUpdateStatus] = useState('');

  const onHandleSubmit = async e => {
		e.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletAddress)
    };

    const data = await fetch('/api/update', requestOptions)
        .then(response => response.json())

    // Update Table
    if (data.success) {
      const data = users.data.map(user => {
        if (user.twitterName === twitterAccountStatus.screenName) {
          return { ...user, ...walletAddress}
        }
        return user;
      });

      setUsers({
        ...users,
        data
      });
    } else {
      setUpdateStatus(data.error);
    }
	};

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await fetch('/api/users').then(res => res.json());
      setUsers(users);
    }

    const checkTwitterAccountStatus = async () => {
        const userInfo = await fetch('/api/verify').then(res => res.json());

        if (userInfo.data) {
            setTwitterAccountStatus({
            isVerify: true,
            screenName: userInfo.data.screenName
            });
        }
    };

    checkTwitterAccountStatus();
    getAllUsers();

    }, [setTwitterAccountStatus]);

  return (
    <div className="App">
      <div className="bgContainer">
				{/* <div className="bgArtContainer">
					<div className="bgImageLeft" />
					<div className="bgArtMiddle" />
					<div className="bgImageRight" />
				</div> */}
			</div>
      <div className="mainContainerWrapper">
        <div className="mainContainer">
        <h1>Symbol Donation List</h1>

          <TwitterSignIn
              twitterAccountStatus={twitterAccountStatus}
              setTwitterAccountStatus={setTwitterAccountStatus}
          />

          {
          twitterAccountStatus.isVerify ?
          <Form
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
              onHandleSubmit={onHandleSubmit}
              updateStatus={updateStatus}
          /> : ''
          }

          <Table userList={users} />
        </div>
      </div>
    </div>
  );
}

export default Home;