import React from 'react';
import LoadingScreen from './LoadingScreen';
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from './hooks/useAxiosPrivate';

const UserManagement = () => {

    const axiosPrivate = useAxiosPrivate();


    const teacherTableColumns = [
        {
            title: "No.",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Họ và tên",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Khoa",
            dataIndex: "department",
            key: "department",
        },
        // {
        //   title: "Action",
        //   render: (_, course) =>
        //     courseSectionTableData.length >= 1 ? (
        //       <Button
        //         type="primary"
        //         shape="circle"
        //         className="bg-[#1677ff]"
        //         onClick={() => handleShowAddStudentModal(course)}
        //       >
        //         +
        //       </Button>
        //     ) : null,
        // },
    ];

    const [teacherTableData, setTeacherTableData] = useState([]);

    const [teacherTableParams, setTeacherTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [teacherTableLoading, setTeacherTableLoading] = useState(true);

    const handleTeacherTableChange = (pagination, filters, sorter) => {
        setTeacherTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }

    useEffect(() => {
        getTeachers();
      }, [teacherTableParams.current, teacherTableParams.pageSize]);

    const getTeachers = async () => {
        // setTeacherTableData([]);
        // setTeacherTableLoading(true);

        try {
            const response = await axiosPrivate.get("/teacher/all");
            let courseList = response.data.body.map((course, index) => {
              return { index: index + 1,...course, value: course.courseId, label: course.courseCode };
            });
            setCourseTableData(courseList);
          } catch (error) {
            showErrorMessage(error);
          }
      };
        

    return (
        <>
        <div className="h-screen grid grid-cols-10 grid-rows-4 gap-4 rounded-xl mr-5">
            <div className="col-span-10 row-span-full col-start-0 bg-gray-50 rounded-xl flex flex-col justify-start items-center">
                <div className="flex flex-row justify-between w-full h-full  p-2">
                    <div className="overflow-x-auto whitespace-no-wrap w-[calc(50%-2.5px)] bg-red-300">
                        <Table
                            columns={teacherTableColumns}
                            dataSource={teacherTableData}
                            pagination={teacherTableParams.pagination}
                            loading={teacherTableLoading}
                            onChange={handleTeacherTableChange}
                            rowKey={(record) => record.id}
                        />
                    </div>
                    <div className="w-[calc(50%-2.5px)] bg-blue-300 ">

                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default UserManagement;