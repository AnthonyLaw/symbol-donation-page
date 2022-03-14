import './Form.scss';
import PropTypes from 'prop-types';
import React from 'react';

// const validator = {
// 	nemAddress: {
// 		rules: [
// 			{
// 			  test: /^[a-z0-9_]+$/,
// 			  message: 'Username must contain only alphabets-numeric lowercase characters',
// 			},
// 			{
// 			  test: (value) => {
// 				return value.length === 40;
// 			  },
// 			  message: 'Nem address must be 40 characters long',
// 			},
// 		],
// 		errors: [],
// 		valid: false,
// 		state: '',
// 	}
// }

const Form = function ({
	walletAddress, setWalletAddress, onHandleSubmit, updateStatus
}) {
	const onHandleChange = event => {
        setWalletAddress({
			...walletAddress,
			[event.target.name]: event.target.value
		});
	};

	return (
		<div className="formContainer">
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

			<div className='infoContainer'>{ updateStatus }</div>
		</div>
	);
};

Form.propTypes = {
	walletAddress: PropTypes.exact({
		nemAddress: PropTypes.string.isRequired,
		symbolAddress: PropTypes.string.isRequired
	}).isRequired,
	setWalletAddress: PropTypes.func.isRequired,
	onHandleSubmit: PropTypes.func.isRequired
};
export default Form;