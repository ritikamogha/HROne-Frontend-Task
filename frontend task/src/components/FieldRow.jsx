import React, { useState } from "react";
import { Input, Select, Button, Card, Tabs } from "antd";

const { Option } = Select;
const { TabPane } = Tabs;

let fieldId = 0;

const getDefaultValue = (type) => {
  switch (type) {
    case "String":
      return "";
    case "Number":
      return 0;
    case "Nested":
      return {};
    default:
      return null;
  }
};

const SchemaField = ({ field, onChange, onDelete }) => {
  const handleChange = (key, value) => {
    onChange({ ...field, [key]: value });
  };

  const handleNestedChange = (index, nestedField) => {
    const updatedFields = [...(field.fields || [])];
    updatedFields[index] = nestedField;
    handleChange("fields", updatedFields);
  };

  const addNestedField = () => {
    handleChange("fields", [
      ...(field.fields || []),
      {
        id: ++fieldId,
        name: "",
        type: "String",
      },
    ]);
  };

  const deleteNestedField = (index) => {
    const updatedFields = [...(field.fields || [])];
    updatedFields.splice(index, 1);
    handleChange("fields", updatedFields);
  };

  return (
    <Card size="small" style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Input
          placeholder="Field Name"
          value={field.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Select
          value={field.type}
          style={{ width: 120 }}
          onChange={(value) => handleChange("type", value)}
        >
          <Option value="String">String</Option>
          <Option value="Number">Number</Option>
          <Option value="Nested">Nested</Option>
        </Select>
        {onDelete && (
          <Button danger onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
      {field.type === "Nested" && (
        <div style={{ paddingLeft: 20, marginTop: 10 }}>
          {(field.fields || []).map((f, index) => (
            <SchemaField
              key={f.id}
              field={f}
              onChange={(updatedField) => handleNestedChange(index, updatedField)}
              onDelete={() => deleteNestedField(index)}
            />
          ))}
          <Button onClick={addNestedField} style={{ marginTop: 8 }}>
            Add Nested Field
          </Button>
        </div>
      )}
    </Card>
  );
};

const buildSchema = (fields) => {
  const result = {};
  for (const field of fields) {
    if (field.type === "Nested") {
      result[field.name] = buildSchema(field.fields || []);
    } else {
      result[field.name] = getDefaultValue(field.type);
    }
  }
  return result;
};

const SchemaBuilder = () => {
  const [fields, setFields] = useState([]);

  const updateField = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        id: ++fieldId,
        name: "",
        type: "String",
      },
    ]);
  };

  const deleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  return (
    <Card style={{ maxWidth: 800, margin: "auto", marginTop: 20 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Schema Builder" key="1">
          {fields.map((field, index) => (
            <SchemaField
              key={field.id}
              field={field}
              onChange={(updated) => updateField(index, updated)}
              onDelete={() => deleteField(index)}
            />
          ))}
          <Button type="primary" onClick={addField} style={{ marginTop: 10 }}>
            Add Field
          </Button>
        </TabPane>
        <TabPane tab="JSON Preview" key="2">
          <pre>{JSON.stringify(buildSchema(fields), null, 2)}</pre>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SchemaBuilder;
