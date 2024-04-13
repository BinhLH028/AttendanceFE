import React, { useState, useEffect, useRef } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { showErrorMessage, showSuccessMessage } from '../util/toastdisplay';
import InfiniteScroll from 'react-infinite-scroll-component';


const { Option } = Select;

const MultiSelectWithPagination = ({
    apiEndpoint,
    optionLabelKey,
    optionValueKey,
    pageSize = 10,
    debounceTime = 1000,
    onChange
}) => {

    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({ current: 0, pageSize });
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, [pagination, searchValue]); // Fetch data on initial render and whenever pagination or search value changes


    const fetchData = async () => {
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axiosPrivate.get(apiEndpoint + "?page=" + pagination.current, searchValue);
            const responseData = response.data.body.content;
            console.log(responseData);
            if (Array.isArray(responseData)) {
                // If the response data is an array, append it to the options state
                setOptions(prevOptions => [...prevOptions, ...responseData]);
            } else if (responseData && typeof responseData === 'object') {
                // If the response data is an object, assume it's a paginated response with an array of items
                const { items } = responseData;
                setOptions(prevOptions => [...prevOptions, ...items]);
            } else {
                console.error('Invalid response data format:', responseData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            console.log("loading");
            setLoading(false); // Set loading state to false when fetching completes
        }
    };

    const handleSearch = debounce(value => {
        setSearchValue(value);
        setPagination(prevPagination => ({
            ...prevPagination,
            current: 1, // Reset current page when searching
        }));
    }, debounceTime);

    const handleLoadMore = () => {
        if (!loading) {
            setPagination(prevPagination => ({
                ...prevPagination,
                current: prevPagination.current + 1,
            }));
        }
    };

    const handleSelectChange = value => {
        // Call the onChange function with the selected value(s)
        onChange(value);
      };

    return (
        <Select
            mode="multiple"
            placeholder="Select options"
            showSearch
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleSelectChange}
            style={{ width: '100%' }}
            dropdownRender={menu => (
                <InfiniteScroll
                    dataLength={options.length}
                    next={handleLoadMore}
                    hasMore={true}
                    loader={<div style={{ textAlign: 'center' }}><Spin /></div>}
                    scrollableTarget="scrollable-dropdown-menu"
                >
                    {menu}
                </InfiniteScroll>
            )}
            dropdownAlign={{
                points: ['tl', 'bl'], // Ensure dropdown menu aligns correctly
            }}
            popupMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 300, overflowY: 'auto' }}
        >
            {options.map(option => (
                <Option key={option[optionValueKey]} value={option[optionValueKey]}>
                    {option[optionLabelKey]}
                </Option>
            ))}
        </Select>
    );
};

export default MultiSelectWithPagination;
