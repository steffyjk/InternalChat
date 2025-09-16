import { useState } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import InviteList from "./InviteList";
import PendingRequests from "./PendingRequests";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  List,
  Space,
  Spin,
  Alert,
} from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Chat({ user }) {
  const authData = JSON.parse(localStorage.getItem("authData") || "null");
  const token = authData?.access_token;

  const { chatList, socketConnected } = useChatSocket(user?.id, token);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState("chat"); // chat | invite | requests
  const [requests, setRequests] = useState([]);

  // Search API
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      setErrorMsg("");
      setSearchResults(null);

      const res = await fetch(
        `http://localhost:8000/auth/search/${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      setSearchResults(data);
      setStep("invite");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending requests
  const handleRequests = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(
        "http://localhost:8000/invite/get_invitation_request",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Requests fetch failed: ${res.status}`);
      const data = await res.json();
      setRequests(data?.data?.invitation_request || []);
      setStep("requests");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Back to chat
  const handleBack = () => {
    setStep("chat");
    setSearchResults(null);
    setRequests([]);
    setSearchTerm("");
  };

  // Step-based rendering
  if (step === "invite") {
    return (
      <InviteList
        searchResults={searchResults}
        onBack={handleBack}
        loading={loading}
        errorMsg={errorMsg}
      />
    );
  }

  if (step === "requests") {
    return (
      <PendingRequests
        requests={requests}
        onBack={handleBack}
        loading={loading}
        errorMsg={errorMsg}
      />
    );
  }

  // Main chat screen
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "16px",
          background: "#fff",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Welcome {user.first_name}
          </Title>

          <Text type={socketConnected ? "success" : "danger"}>
            Socket status: {socketConnected ? "Connected" : "Disconnected"}
          </Text>

          <Form layout="inline" onFinish={handleSearch} style={{ gap: 8 }}>
            <Form.Item style={{ flex: 1, marginBottom: 0 }}>
              <Input
                placeholder="Search by phone number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Search
              </Button>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button onClick={handleRequests} loading={loading}>
                Requests
              </Button>
            </Form.Item>
          </Form>

          {errorMsg && <Alert type="error" message={errorMsg} showIcon />}

          <Title level={4} style={{ marginTop: 16 }}>
            Your Chats
          </Title>

          {loading ? (
            <Spin />
          ) : chatList.length === 0 ? (
            <Text type="secondary">No chats yet.</Text>
          ) : (
            <List
              dataSource={chatList}
              bordered
              renderItem={(chat) => (
                <List.Item key={chat.conversation_id}>
                  <List.Item.Meta
                    title={<strong>{chat.name}</strong>}
                    description={chat.last_message}
                  />
                </List.Item>
              )}
            />
          )}
        </Space>
      </Content>
    </Layout>
  );
}
