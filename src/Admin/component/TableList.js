import React from 'react';


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const TableList = ({ onClickHandler, operator, index }) => {
  return (
    <tr onClick={() => onClickHandler(operator.userId)}>
      <td>{index + 1}</td> {/* "No" column */}
      <td>{operator.userName}</td>
      <td>{operator.firstName}</td>
      <td>{operator.lastName}</td>
      <td>{operator.emailAddress}</td>
      <td>{operator.contactNumber}</td>
      <td>{capitalizeFirstLetter(operator.status)}</td> {/* Account Status */}
      <td>{operator.terminal}</td>
    </tr>
  );
};

export default TableList;
