import React, { memo, useEffect, useState } from 'react';
import './QueryResult.scss';
import { getUser, updateUser, deleteUser } from '../../api/userAPI';
import { useSelector } from 'react-redux';
import Notifycation from '../notification';
import verifyEmail from '../../verify/email';
import { FaTrash } from 'react-icons/fa'

function QueryResult() {
  const [editingField, setEditingField] = useState(null); // Tracks the field being edited
  const [data, setData] = useState([]); // Holds the user data
  const [originalData, setOriginalData] = useState([]); // Holds the original data for rollback
  const [userData, setUserData] = useState(null);
  const [show, setShow] = useState({ status: false, message: '', type: '' });
  const [searchQuery, setSearchQuery] = useState(''); // Holds the search query
  const [filteredData, setFilteredData] = useState([]); // Holds the filtered data based on search query

  const user = useSelector(state => state.auth?.user?.data) || {}; // Access user data from redux store

  useEffect(() => {
    const fetching = async () => {
      const res = await getUser({ path: 'get-all' }); // Fetch all users

      const modifiedData = res.data.map(item => {
        const { lastUpdatedDate, updatedAt, __v, createdAt, grade, status, ...rest } = item; 
        const updatedItem = {
          ...rest,
          grade: grade ? grade : "không có lớp học", // Add grade name
        };
        return updatedItem;
      });

      setData(modifiedData); // Set the modified data
      setOriginalData(modifiedData); // Save the original data for rollback
      setFilteredData(modifiedData); // Initialize the filtered data with the full data
    };
    fetching();
  }, []); // This useEffect runs once when the component is mounted

  const handleChange = (index, field, value) => {
    // Update the field of the specific user at index
    const updatedData = [...filteredData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };
    setFilteredData(updatedData);
  };

  const handleEdit = (index, field) => {
    setEditingField({ index, field });
  };

  const handleSave = async () => {
    const newData = { ...filteredData[editingField.index] };

    if (!newData.name.trim()) {
      return setShow({ status: true, message: 'Tên không thể bỏ trống', type: 'warning' });
    }

    if (!newData.email && !verifyEmail(newData.email)) {
      return setShow({ status: true, message: 'Email không hợp lệ', type: 'warning' });
    }

    if (newData.level < 0 || newData.level > 2) newData.level = 2;

    setShow({ status: true, message: 'Đang cập nhật...', type: 'info' });
    
    const res = await updateUser({ path: 'update', ...newData });
    
    res.status === 200 && setShow({ status: true, message: 'Cập nhật thành công', type: 'success' });
    res.status !== 200 && setShow({ status: true, message: 'Cập nhật không thành công', type: 'warning' });
    
    setEditingField(null); // Exit editing mode after saving
  };

  const handleCancel = () => {
    // Restore the original data when canceling
    setFilteredData([...originalData]); // Reset data to the original state
    setEditingField(null); // Exit editing mode
  };

  const handleDelete = async (userId) => {
    setShow({ status: true, message: 'Đang xóa người dùng', type: 'info' });
    const res = await deleteUser({ _id: userId });
    if (res.status === 200) {
      setFilteredData(filteredData.filter(user => user._id !== userId)); // Remove the deleted user from the UI
      setShow({ status: true, message: 'Xóa người dùng thành công', type: 'success' });
    } else setShow({ status: true, message: 'Xóa người dùng thất bại', type: 'warning' });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on query
    const filtered = originalData.filter(item => {
      const { grade, email, name, level } = item;
      return (
        grade?.toLowerCase().includes(query) || // Search in grade
        email?.toLowerCase().includes(query) || // Search in email
        name?.toLowerCase().includes(query) || // Search in name
        level?.toString().includes(query) // Search in level
      );
    });

    setFilteredData(filtered);
  };

  return (
    <div className='query-result'>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên học sinh, lớp, hoặc khay..."
        />
      </div>

      {show.status && <Notifycation message={show.message} type={show.type} onClose={() => setShow({ status: false, message: '', type: '' })} />}

      {filteredData.map((el, index) => (
        user._id !== el._id && (
          <div className="query-result-container" key={el._id}>
            <div className="query-details">
              {Object.entries(el).map(([field, value]) => (
                (field !== 'password' && field !== '_id') && (
                  <div key={field} className="query-item">
                    <span className="field-name">{field}:</span>
                    {editingField?.index === index && editingField?.field === field ? (
                      <input
                        className="input-field"
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, field, e.target.value)} // Update the specific field
                        autoFocus
                      />
                    ) : (
                      <span className="field-value" onClick={() => handleEdit(index, field)}>{value}</span>
                    )}
                  </div>
                )
              ))}
            </div>

            {editingField && editingField.index === index && (
              <div className="update-button-container">
                <button className="cancel-button" onClick={handleCancel}>Hủy</button>
                <button className="update-button" onClick={handleSave}>Cập nhật</button>
              </div>
            )}

            {/* Delete button */}
            <button
              className="delete-button"
              onClick={() => handleDelete(el._id)}  // Call handleDelete with userId
            >
              <FaTrash/>
            </button>
          </div>
        )
      ))}
    </div>
  );
}

export default memo(QueryResult);
