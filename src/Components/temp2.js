import React, { useState, useEffect } from "react";
import { Table, Pagination, Checkbox, Space, Button, Modal } from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditModal from "./EditModal";

const PaginatedTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteSingleModalVisible, setIsDeleteSingleModalVisible] =
    useState(false);
  const [isDeleteMultipleModalVisible, setIsDeleteMultipleModalVisible] =
    useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setDataSource(response.data);
        setTotalItems(response.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: () => (
        <Checkbox
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < dataSource.length
          }
          checked={selectedRows.length === dataSource.length}
          onChange={handleSelectAllChange}
        />
      ),
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.includes(record.id)}
          onCl={(e) => handleCheckboxChange(e, record.id)}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (e, id) => {
    const checked = e.target.checked;
    setSelectedRows((prevSelectedRows) =>
      checked
        ? [...prevSelectedRows, id]
        : prevSelectedRows.filter((rowId) => rowId !== id)
    );
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;

    const currentPageIds = dataSource
      .slice(startIndex, endIndex)
      .map((row) => row.id);

    setSelectedRows(checked ? currentPageIds : []);
  };

  const handleEdit = (record) => {
    setSelectedPerson(record);
    setIsEditModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedRows.length === 1) {
      const selectedRow = dataSource.find((row) => row.id === selectedRows[0]);

      setSelectedPerson(selectedRow);

      setIsDeleteSingleModalVisible(true);
    } else if (selectedRows.length > 1) {
      setIsDeleteMultipleModalVisible(true);
    }
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: totalItems,
    onChange: handlePageChange,
  };

  const handleDeleteSingleModalOk = () => {
    setDataSource((prevDataSource) =>
      prevDataSource.filter((row) => row.id !== selectedPerson.id)
    );

    setIsDeleteSingleModalVisible(false);

    setSelectedRows([]);
  };
  const updatePerson = (personId, updatedValues) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((person) =>
        person.id === personId ? { ...person, ...updatedValues } : person
      )
    );
  };

  const handleDeleteSingleModalCancel = () => {
    setIsDeleteSingleModalVisible(false);

    setSelectedRows([]);
  };

  const handleDeleteMultipleModalOk = () => {
    setDataSource((prevDataSource) =>
      prevDataSource.filter((row) => !selectedRows.includes(row.id))
    );

    setIsDeleteMultipleModalVisible(false);

    setSelectedRows([]);
  };

  const handleDeleteMultipleModalCancel = () => {
    setIsDeleteMultipleModalVisible(false);

    setSelectedRows([]);
  };

  const startIndex = (currentPage - 1) * 10;
  const endIndex = currentPage * 10;

  return (
    <div>
      <Table
        dataSource={dataSource.slice(startIndex, endIndex)}
        columns={columns}
        pagination={false}
      />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
      >
        <Pagination {...paginationConfig} />
      </div>
      <EditModal
        isModalVisible={isEditModalVisible}
        handleCancel={() => setIsEditModalVisible(false)}
        selectedPerson={selectedPerson}
        updatePerson={updatePerson}
      />
      {selectedRows && selectedRows.length > 0 && (
        <Modal
          title="Delete Confirmation"
          visible={isDeleteMultipleModalVisible}
          onCancel={handleDeleteMultipleModalCancel}
          onOk={handleDeleteMultipleModalOk}
        >
          <p>Are you sure you want to delete the selected row(s)?</p>
        </Modal>
      )}
      <Modal
        title="Delete Confirmation"
        visible={isDeleteSingleModalVisible}
        onCancel={handleDeleteSingleModalCancel}
        onOk={handleDeleteSingleModalOk}
      >
        {selectedPerson && (
          <p>
            Are you sure you want to delete the row for {selectedPerson.name}?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default PaginatedTable;