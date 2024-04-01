import React from 'react';
import { Table } from 'antd';
import './../style/AddSemester.css';

const outerColumns = [
  { title: 'Mã lớp học', dataIndex: 'courseCode', key: 'courseCode' },
  { title: 'Tên lớp học', dataIndex: 'courseName', key: 'courseName' },
  { title: 'Giảng viên', dataIndex: 'teacherName', key: 'teacherName' },
];

const innerColumns = [
    { title: 'Mã sinh viên', dataIndex: 'userCode', key: 'userCode' },
    { title: 'Họ và tên', dataIndex: 'userName', key: 'userName' },
    { title: 'Ngày sinh', dataIndex: 'dob', key: 'dob' },
  ];

  const data = [
    {
      key: '1',
      courseCode: 'CNTT 01',
      courseName: 'Introduction to React',
      teacherName: 'teacher1',
      children: [
        {
          key: '11',
          userCode: '001',
          userName: 'Alice',
          dob: '1990-01-01',
        },
        {
          key: '12',
          userCode: '002',
          userName: 'Bob',
          dob: '1992-05-15',
        },
      ],
    },
    {
      key: '2',
      courseCode: 'CNTT 02',
      courseName: 'Advanced JavaScript',
      teacherName: 'teacher1, teacher2',
      children: [
        {
          key: '21',
          userCode: '003',
          userName: 'Charlie',
          dob: '1988-07-20',
        },
        {
          key: '22',
          userCode: '004',
          userName: 'David',
          dob: '1991-11-30',
        },
      ],
    },
  ];

const App = () => {
  return (
    <Table
      columns={outerColumns}
      dataSource={data}
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={innerColumns}
            dataSource={record.children}
            pagination={{ pageSize: 5 }} // Set pagination for inner table
          />
        ),
        rowExpandable: (record) => record.children && record.children.length > 0,
      }}
    />
  );
};

export default App;