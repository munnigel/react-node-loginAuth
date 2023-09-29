import React from 'react';
import { Select } from 'antd';

const AgencySelection = (children) => {
  const options = [
    {
      value: '@yahoo.com.sg',
      label: 'Ministry of Manpower (MOM)',
    },
    {
      value: '@htx.gov.sg',
      label: 'Home Team Science and Technology Agency (HTX)',
    },
    {
      value: '@ihis.gov.sg',
      label: 'Integrated Health Information Systems (IHiS)',
    },
    {
      value: '@ica.gov.sg',
      label: 'Immigration & Checkpoints Authority (ICA)',
    }
  ];

  const filterOption = (input, option) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <Select
      id='agency'
      showSearch
      placeholder='Select your agency'
      options={options}
      required
      filterOption={filterOption}
      style={{ cursor: 'pointer' }}
      {...children}
      ref={children.reference}
    />
  );
};

export default AgencySelection;
