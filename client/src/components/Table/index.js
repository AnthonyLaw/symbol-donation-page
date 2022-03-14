import './Table.scss';
import PropTypes from 'prop-types';
import React from 'react';

const Table = function ({ userList }) {
    const renderItem = (users) => {
        return users.data.map((user, key) => {
          return(
            <tr key={key}>
              <td><a href={`https://twitter.com/${user.twitterName}`}>@{user.twitterName}</a></td>
              <td><a href={`https://explorer.nemtool.com/#/s_account?account=${user.nemAddress}`}>{user.nemAddress}</a></td>
              <td><a href={`https://symbol.fyi/accounts/${user.symbolAddress}`}>{user.symbolAddress}</a></td>
            </tr>
          )
        })
      }

	return (
		<table className='tableContainer'>
        <thead>
          <tr>
            <th>Twitter</th>
            <th>NEM</th>
            <th>SYMBOL</th>
          </tr>
        </thead>
          <tbody>
            { userList.data.length > 0 ? renderItem(userList) : 'No data available' }
          </tbody>
      </table>
	);
};

Table.propTypes = {
    userList: PropTypes.exact({
		data: PropTypes.array.isRequired,
		success: PropTypes.bool.isRequired
	}).isRequired,
};

export default Table;
