import { useState, useEffect } from "react";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { Button, Form, Input, InputNumber, Select, Table, message, Upload } from "antd";
import { showErrorMessage, showSuccessMessage } from "../util/toastdisplay";
import httpClient from "../api/http-common";
import "./../style/ManageStyle.css";

const Manage = () => {

  const axiosPrivate = useAxiosPrivate();

  const [sectionOptions, setSectionOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [value, setValue] = useState(1);
  const [pageNum, setPageNum] = useState(0);
  let flattenedList = [];


  const [filter, setFilter] = useState({
    sectionId: value,
    userCode: '',
    username: '',
    courseCode: '',
    courseName: '',
    team: '',
    totalAbsence: null
  });

  const [shouldBindKeyDown, setShouldBindKeyDown] = useState(false);

  const renderBooleanIcon = (value) => {
    let icon;
    let bgColor;
    if (value === true) {
      icon = '✓'; // 'v' for true
      bgColor = 'lightgreen';
    } else if (value === false) {
      icon = '✘'; // 'x' for false
      bgColor = 'Tomato';
    } else {
      icon = '◯'; // 'o' for null
    }
    return <span className="boolean-cell" style={{ backgroundColor: bgColor }}>
      {icon}
    </span>;
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      width: 10,
      fixed: 'left',
      key: "index",
    },
    {
      title: "Mã sinh viên",
      dataIndex: "userCode",
      key: "userCode",
      fixed: 'left',
      width: 100,
    },
    {
      title: "Tên sinh viên",
      dataIndex: "username",
      key: "username",
      fixed: 'left',
      width: 150,
    },
    {
      title: "Mã môn học",
      dataIndex: "courseCode",
      key: "courseCode",
      fixed: 'left',
    },
    {
      title: "Tên môn học",
      dataIndex: "courseName",
      key: "courseName",
      fixed: 'left',
      width: 200,
    },
    {
      title: "Giảng viên",
      dataIndex: "teacherName",
      key: "teacherName",
      fixed: 'left',
      width: 200,

    },
    {
      title: "Nhóm",
      dataIndex: "team",
      key: "team",
      fixed: 'left',
    },
    {
      title: "Số buổi vắng",
      dataIndex: "totalAbsence",
      key: "totalAbsence",
      fixed: 'left',
    },
    {
      title: "Buổi 1",
      dataIndex: "lecture1",
      key: "lecture1",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 2",
      dataIndex: "lecture2",
      key: "lecture2",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 3",
      dataIndex: "lecture3",
      key: "lecture3",
      render: renderBooleanIcon,
      render: renderBooleanIcon
    },
    {
      title: "Buổi 4",
      dataIndex: "lecture4",
      key: "lecture4",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 5",
      dataIndex: "lecture5",
      key: "lecture5",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 6",
      dataIndex: "lecture6",
      key: "lecture6",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 7",
      dataIndex: "lecture7",
      key: "lecture7",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 8",
      dataIndex: "lecture8",
      key: "lecture8",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 9",
      dataIndex: "lecture9",
      key: "lecture9",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 10",
      dataIndex: "lecture10",
      key: "lecture10",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 11",
      dataIndex: "lecture11",
      key: "lecture11",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 12",
      dataIndex: "lecture12",
      key: "lecture12",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 13",
      dataIndex: "lecture13",
      key: "lecture13",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 14",
      dataIndex: "lecture14",
      key: "lecture14",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 15",
      dataIndex: "lecture15",
      key: "lecture15",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 16",
      dataIndex: "lectureOption1",
      key: "lectureOption1",
      render: renderBooleanIcon
    },
    {
      title: "Buổi 17",
      dataIndex: "lectureOption2",
      key: "lectureOption2",
      render: renderBooleanIcon
    }

  ];

  const rowClassName = (record, index) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row'; // Apply different class for even and odd rows
  };

  const generateInputs = (columns) => {
    const inputs = [];
    let stopGenerating = false; // Flag to stop generating inputs once we reach "totalAbsence" column
    columns.forEach(column => {
      if (!stopGenerating && column.dataIndex !== 'teacherName' && column.dataIndex !== 'index') {
        inputs.push(
          <Input
            key={column.key}
            placeholder={`${column.title}`}
            className="w-48 py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            style={{ width: column.width ? column.width : 'auto', margin: "5px" }}
            onChange={(e) => updateFilter(column.dataIndex, e.target.value)}
            onKeyDown={shouldBindKeyDown ? (e) => handleEnterKeyPress(e) : null} // Listen for Enter key press
            onFocus={() => setShouldBindKeyDown(true)} // Set shouldBindKeyDown to true when input is focused
            onBlur={() => setShouldBindKeyDown(false)} // Reset shouldBindKeyDown when input loses focus
            rowClassName={rowClassName}
            bordered
          />
        );
      }
      if (column.dataIndex === 'totalAbsence') {
        stopGenerating = true; // Set flag to stop generating inputs once we reach "totalAbsence" column
      }
    });
    return inputs;
  };

  const inputs = generateInputs(columns);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableData([]);
    }
  };

  const getSections = async () => {
    try {
      const response = await httpClient.get("/section");
      if (response) {
        var listData = [];
        response.data.body.map((res) => {
          listData.push({
            label: "Học kì " + res.semester + " năm " + res.year,
            value: res.sectionId,
          });
        });
        setSectionOptions(listData);
      }
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const getTableData = async (value) => {
    setTableData([]);
    setTableLoading(true);
    try {
      const response = await httpClient.post(`/management?page=${value - 1}&ps=${tableParams.pagination.pageSize}`, filter);
      response.data.body.content.map((item, index) => {
        // Destructure 'attendanceSheet' object from the item
        const { attendanceSheet, totalAbsence, ...rest } = item;
        // Merge 'attendanceSheet' properties directly into the item
        const flattenedItem = {
          index: index + 1,
          ...rest,
          ...attendanceSheet
        };
        // Push the flattened item into the list
        flattenedList.push(flattenedItem);
      });
      setTableData(flattenedList);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: value,
          total: response.data.body.totalElements,
        },
      });
      setTableLoading(false);
    } catch (error) {
      console.log(error);
      showErrorMessage(error);
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      getTableData(1);
    }
  }

  const updateFilter = async (propertyName, value) => {
    setFilter(prevState => ({
      ...prevState,
      [propertyName]: value
    }));
  };

  const handleChange = async (value) => {
    setValue(value);
    updateFilter('sectionId', value)
  };

  useEffect(() => {
    getTableData(tableParams.pagination.current);
  }, [JSON.stringify(tableParams), value]);

  // init data
  useEffect(() => {
    getSections();
    // getTableData();
  }, []);


  return (
    <div className="h-screen grid grid-cols-10 grid-rows-4 gap-4 rounded-xl">
      <div className="col-span-10 row-span-full col-start-0 bg-gray-50 rounded-xl flex flex-col justify-start items-center">
        <Select
          allowClear
          className="w-1/5 my-4"
          placeholder="Chọn học kỳ"
          onChange={handleChange}
          options={sectionOptions}
        />
        <div className=" bg-gray-100 p-3 rounded-xl ">
          {inputs}
        </div>
        <div className="overflow-x-auto whitespace-no-wrap w-full">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={tableParams.pagination}
            loading={tableLoading}
            onChange={handleTableChange}
            rowKey={(record) => record.id}
            style={{ fontSize: '5px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Manage;
