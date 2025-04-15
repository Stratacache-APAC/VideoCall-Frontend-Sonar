import React, { useEffect }  from 'react';

export const AuditTableList = ({ operator }) => {

  return (
    <tr>
      <td>{operator.operatorName}</td>
      <td>{operator.callOrigin}</td>
      <td>{operator.reason}</td>
      <td>{operator.callStartTime}</td>
      <td>{operator.callEndTime}</td>
      <td>{operator.callDuration}</td>
    </tr>
  );
};


export default AuditTableList;
