import React, { useEffect, useState } from 'react';
import * as Service from '../utils/Service/Service';
import './Operator.css';

import NavbarLocal from '../Navbar/Navbar';
import Moment from 'moment';
import GridTable from '@nadavshaar/react-grid-table';
import LogoImage from '../resources/GMR_delhi_combine_logo.png'; // Update the path





const AuditListInit = () => {


  let [operators, setOperator] = useState(null);


  const columns = [
    {
      id: 1,
      field: 'callOrigin',
      label: 'Call Origin',
      sortable: false
    },
    {
      id: 2,
      field: 'callOriginationTime',
      label: 'Call Origin Time',
      sortable: false
    },
    {
      id: 3,
      field: 'callStatus',
      label: 'Call Status',
      sortable: false
    }
  ];


  useEffect(() => {
    Service.fetchData('getMissedCallReport').then(res => {
      //change the date time format
      console.log(res);
      const format1 = "YYYY-MM-DD HH:mm:ss"
      for (const key in res) {
        if (res[key].callOriginationTime) {
          res[key].callOriginationTime = Moment(res[key].callOriginationTime).format(format1);
          res[key].callStatus = 'Missed Call';
        }
      }
      setOperator(res);
    });
  }, []);

  return (
    <>
      <div className="row">
        {/* Navbar with a span of 2 columns */}
        <div className="col-2">
          <NavbarLocal />
        </div>
        <div className="col-10">
          <div className="top-image-container" style={{ zIndex: '99', top: '-25px', left: '-65px' }}>
            {/* <img src={LogoImage} alt="GMR Delhi Logo" className="logo-image" /> */}
          </div>
          <div className='m-2 p-3'>
            <div className='frame_table_border'>
              <div className=' bg_color p-2 d-flex'>
                <div className=''>
                  <span className='text-light font_weight_500 font_size_large'>Call List</span>
                </div>
              </div>
              {operators && <GridTable columns={columns} rows={operators} />};
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditListInit;