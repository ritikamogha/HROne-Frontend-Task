import React, { useState } from "react";
import FieldRow from "./FieldRow";
import { Button, Card } from "antd";

let idCounter = 1;

const generateJson = (fields) => {
  const result = {};
  fields.forEach((field) => {
    if (field.type === "Nested") {
      result[field.key] = generateJson(field.children || []);
    } else {
      result[field.key] = field.type.toLowerCase();
    }
  });
  return result;
};

export default function SchemaBuilder() {
  const [fields, setFields] = useState([]);

  const addField = (parentId = null) => {
    const newField = {
      id: idCounter++,
      key: "key",
      type: "String",
      children: [],
    };

    if (!parentId) {
      setFields([...fields, newField]);
    } else {
      const update = (list) =>
        list.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newField],
            };
          } else if (item.type === "Nested") {
            return { ...item, children: update(item.children || []) };
          }
          return item;
        });

      setFields(update(fields));
    }
  };

  const updateField = (id, key, value) => {
    const update = (list) =>
      list.map((item) => {
        if (item.id === id) {
          return { ...item, [key]: value };
        } else if (item.type === "Nested") {
          return { ...item, children: update(item.children || []) };
        }
        return item;
      });

    setFields(update(fields));
  };

  const deleteField = (id) => {
    const remove = (list) =>
      list.filter((item) => item.id !== id).map((item) => {
        if (item.type === "Nested") {
          return { ...item, children: remove(item.children || []) };
        }
        return item;
      });

    setFields(remove(fields));
  };

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <Card style={{ flex: 1 }} title="Schema Builder">
        <Button type="primary" onClick={() => addField()}>
          + Add Field
        </Button>
        <div style={{ marginTop: 16 }}>
          {fields.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              onAdd={addField}
              onChange={updateField}
              onDelete={deleteField}
            />
          ))}
        </div>
      </Card>

      <Card style={{ flex: 1 }} title="JSON Preview">
        <pre>{JSON.stringify(generateJson(fields), null, 2)}</pre>
      </Card>
    </div>
  );
}
