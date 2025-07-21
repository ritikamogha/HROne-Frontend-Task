import React from "react";
import SchemaBuilder from "./components/SchemaBuilder";
import { Layout, Typography } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: "100vh", padding: 20 }}>
      <Header style={{ background: "#001529" }}>
        <Title style={{ color: "white", margin: 0 }} level={3}>
          JSON Schema Builder
        </Title>
      </Header>
      <Content style={{ marginTop: 20 }}>
        <SchemaBuilder />
        
      </Content>
    </Layout>
  );
}

export default App;


