import React from 'react';
import { Select } from 'antd';

const AgencySelection = ({ agency, setAgency, reference }) => {
  const options = [
    {
      value: '@mom.gov.sg',
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
      style={{ width: '85%' }}
      onChange={(value) => setAgency(value)}
      value={agency}
      ref={reference}
    />
  );
};

export default AgencySelection;
