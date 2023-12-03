import React from "react";
import { Modal, Form, Input } from "antd";

const EditModal = ({
  isModalVisible,
  handleCancel,
  selectedPerson,
  updatePerson,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Call the updatePerson function to update the person in memory
        updatePerson(selectedPerson.id, values);

        // Close the modal
        handleCancel();
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title="Edit Person"
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form form={form} initialValues={selectedPerson}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
