import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const TwitterSignIn = function ({
	twitterAccountStatus,
	setTwitterAccountStatus
}) {
	const [isLoading, setIsLoading] = useState(false);

	const twitterAuth = async () => {
		setIsLoading(true);

		const data = await fetch('/api/twitter/auth').then(res => res.json());

		localStorage.setItem('twitter_oauth_token_secret', data.oauth_token_secret);

		window.location.href = data.url;
	}

	const twitterLogout = async () => {
		const data = await fetch('/api/logout').then(res => res.json());

		if (data.success) {
			setTwitterAccountStatus({
			  isVerify: false,
			  screenName: ''
			});
		  }
	};

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const oauthToken = query.get('oauth_token');
		const oauthVerifier = query.get('oauth_verifier');

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

		if (null !== oauthToken && null !== oauthVerifier)
			twitterVerify(oauthToken, oauthVerifier);

        }, [setTwitterAccountStatus]);

        return (
            <div>
                {
                    twitterAccountStatus.isVerify
                        ? <button type="button" onClick={twitterLogout}>{`Sign out @${twitterAccountStatus.screenName}`}</button>
                        : <button type="button" onClick={twitterAuth} disabled={isLoading}>Sign In with twitter</button>
                }
            </div>
        );
    };

TwitterSignIn.propTypes = {
    twitterAccountStatus: PropTypes.exact({
        isVerify: PropTypes.bool.isRequired,
        screenName: PropTypes.string.isRequired
    }).isRequired,
    setTwitterAccountStatus: PropTypes.func.isRequired
};

export default TwitterSignIn;