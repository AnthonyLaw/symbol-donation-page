import React, { useState, useEffect } from 'react';
import './App.css';

const App = function () {
  const [isLoading, setIsLoading] = useState(false);

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

  const twitterAuth = async () => {
    setIsLoading(true);

    const data = await fetch('/api/twitter/auth').then(res => res.json());

		localStorage.setItem('twitter_oauth_token_secret', data.oauth_token_secret);

		window.location.href = data.url;
  }

  const twitterLogout = async () => {
    // Todo: Logout
    const data = await fetch('/api/logout').then(res => res.json());

    if (data.success) {
      setTwitterAccountStatus({
        isVerify: false,
        screenName: ''
      });
    }
  }

  const onHandleChange = event => {
		setWalletAddress({
			...walletAddress,
			[event.target.name]: event.target.value
		});
	};

  const onHandleSubmit = async e => {
		e.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletAddress)
    };

    await fetch('/api/update', requestOptions)
        .then(response => response.json())

    // Todo: Update Dataset with new data
	};

  useEffect(() => {
		// const twitter_info = JSON.parse(localStorage.getItem('twitter_info'));

		const query = new URLSearchParams(window.location.search);
		const oauthToken = query.get('oauth_token');
		const oauthVerifier = query.get('oauth_verifier');

    const getAllUsers = async () => {
      const users = await fetch('/api/users').then(res => res.json());
      setUsers(users);
    }

		const twitterVerify = async () => {
			setIsLoading(true);

			const oauthTokenSecret = localStorage.getItem('twitter_oauth_token_secret');

			const data = await fetch(`/api/twitter/verify?oauthToken=${oauthToken}&oauthTokenSecret=${oauthTokenSecret}&oauthVerifier=${oauthVerifier}`).then(res => res.json());

			if (data.success) {
        document.location.href = '/';
			}

			setIsLoading(false);
		};

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

		if (null !== oauthToken && null !== oauthVerifier)
			twitterVerify(oauthToken, oauthVerifier);

    }, [setTwitterAccountStatus]);

  return (
    <div className="App">
      <h1>Symbol Donation List</h1>
      {
        twitterAccountStatus.isVerify
        ? <button type="button" onClick={twitterLogout}>{`Sign out @${twitterAccountStatus.screenName}`}</button>
        : <button type="button" onClick={twitterAuth} disabled={isLoading}>Sign In with twitter</button>
      }

      {
        twitterAccountStatus.isVerify ?
<div>
        <input
          name="nemAddress"
          value={walletAddress.nemAddress}
          className="formInput"
          type="text"
          placeholder="Nem Address"
          onChange={onHandleChange}
        />

        <input
          name="symbolAddress"
          value={walletAddress.symbolAddress}
          className="formInput"
          type="text"
          placeholder="Symbol Address"
          onChange={onHandleChange}
        />

        <button
          className="formButton"
          type="submit"
          onClick={e => onHandleSubmit(e)}
        >
          Update
        </button>
      </div> : ''
      }

      <table>
        <thead>
          <tr>
            <th>Twitter</th>
            <th>Nem Address</th>
            <th>Symbol Address</th>
          </tr>
        </thead>
          <tbody>
          {
            users.data.length > 0 ?
            users.data.map((user, key) => {
              return(
                <tr key={key}>
                  <td>@{user.twitterName}</td>
                  <td>{user.nemAddress}</td>
                  <td>{user.symbolAddress}</td>
                </tr>
              )
            })
            : 'No data available'
          }
          </tbody>
      </table>

    </div>
  );
}

export default App;