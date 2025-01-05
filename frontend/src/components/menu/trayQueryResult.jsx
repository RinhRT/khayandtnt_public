import React, { memo, useEffect, useState } from 'react';
import './QueryResult.scss';
import { getAllTrayStatus, updateTray, deleteTray } from '../../api/trayAPI'; // Assuming you have similar tray API functions
import { FaTrash } from 'react-icons/fa';
import Notification from '../notification';

function TrayQueryResult() {
  const [editingField, setEditingField] = useState(null); // Tracks the field being edited
  const [data, setData] = useState([]); // Holds the tray data
  const [originalData, setOriginalData] = useState([]); // Holds the original data for rollback
  const [searchQuery, setSearchQuery] = useState(''); // Holds the search query
  const [filteredData, setFilteredData] = useState([]); // Holds the filtered data based on search query

  const [mode, setMode] = useState({ status: false, message: '', type: '' })

  // Fetch tray data on mount
  useEffect(() => {
    const fetching = async () => {
      const res = await getAllTrayStatus(); // Fetch all tray status data
      const modifiedData = res.data.map(item => {
        const { userID, gradeID, name, status, _id } = item; 
        return {
          name,
          userID: item?.userID === null ? 'Chưa có ai lấy' : userID.name,
          gradeID: item?.gradeID === null ? 'Chưa có ai lấy' : gradeID.name,
          status: !item?.status ? 'Chưa nhận' : 'Đã nhận',
          _id }; // Only keep the required fields
      });
      setData(modifiedData);
      setOriginalData(modifiedData); // Save the original data for rollback
      setFilteredData(modifiedData);
    };
    fetching();
  }, []); // Runs once when the component is mounted

  // Handle changes in input fields
  const handleChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };
    setData(updatedData);
  };

  // Start editing a specific field
  const handleEdit = (index, field) => {
    setEditingField({ index, field });
  };

  // Save changes made to the tray
  const handleSave = async () => {
    const updatedTray = { _id: data[editingField.index]._id };

    // If status is edited, set userID and gradeID to null
    if (updatedTray.status !== 'Đã nhận') {
      updatedTray.userID = null;
      updatedTray.gradeID = null;
      updatedTray.status = false
    }

    setMode({ status: true, message: 'Đang thực hiện yêu cầu', type: 'info' })

    const res = await updateTray(updatedTray); // Update tray data

    res.status === 200 && setMode({ status: true, message: 'Cập nhật khay thành công', type: 'success' })
    res.status > 300 && setMode({ status: true, message: 'Cập nhật khay thất bại', type: 'warning' })

    setEditingField(null); // Exit editing mode after saving
  };

  // Cancel editing and restore original data
  const handleCancel = () => {
    setData([...originalData]); // Reset data to the original state
    setEditingField(null); // Exit editing mode
  };

  // Handle deletion of a tray
  const handleDelete = async (trayId) => {
    setMode({ status: true, message: 'Đang thực hiện yêu cầu', type: 'info' })

    const res = await deleteTray({ _id: trayId }); // Delete tray from backend
    const dataTest = data.filter(tray => tray._id !== trayId);
    
    setMode({ status: true, message: 'Xóa khay thành công', type: 'success' })

    setData(dataTest); // Remove the deleted tray from the UI
    setOriginalData(dataTest); // Save the original data for rollback
    setFilteredData(dataTest);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on query
    const filtered = originalData.filter(item => {
      const { gradeID, name, status, userID } = item;
      return (
        gradeID?.toLowerCase().includes(query) || 
        name?.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query) ||
        userID.toLowerCase().includes(query)
      );
    });

    setFilteredData(filtered);
  };

  const handleCloseMessage = () => {
    setMode({ status: false, message: '', type: '' })
  }

  return (
    <div className='query-result'>

      {
        mode.status && <Notification message={mode.message} type={mode.type} onClose={handleCloseMessage}/>
      }

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên học sinh, lớp, hoặc khay..."
        />
      </div>

      {filteredData.map((tray, index) => (
        <div className="query-result-container" key={tray._id}>
          <div className="query-details">
            {Object.entries(tray).map(([field, value]) => (
              // Only render the fields we want to display (userID, gradeID, name, status)
              (field === 'userID' || field === 'gradeID' || field === 'name' || field === 'status') && (
                <div key={field} className="query-item">
                  <span className="field-name">{field}:</span>
                  { field ==='status' && editingField?.index === index && editingField?.field === field ? (
                    field === 'status' ? (
                      // Render a dropdown for the 'status' field but only allow changing from 'Đã nhận' to 'Chưa nhận'
                      <select
                        className="input-field"
                        value={value}
                        onChange={(e) => handleChange(index, field, e.target.value)}
                      >
                        {value === 'Đã nhận' ? (
                          <option value="Chưa nhận">Chưa nhận</option>
                        ) : (
                          <option value="Chưa nhận">Chưa nhận</option>
                        )}
                      </select>
                    ) : (
                      // For other fields, use a regular input
                      <input
                        className="input-field"
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(index, field, e.target.value)}
                        autoFocus
                      />
                    )
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
            onClick={() => handleDelete(tray._id)}  // Call handleDelete with trayId
          >
            <FaTrash/>
          </button>
        </div>
      ))}
    </div>
  );
}

export default memo(TrayQueryResult);
