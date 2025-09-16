import { useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Card,
  Spin,
  Alert,
  Space,
} from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function InviteList({ searchResults, onBack, loading, errorMsg }) {
  const userDetails = searchResults?.data?.user_details || {};
  const userExists = userDetails && Object.keys(userDetails).length > 0;

  const [inviteStatus, setInviteStatus] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleInvite = async () => {
    const authData = JSON.parse(localStorage.getItem("authData") || "null");
    const token = authData?.access_token;

    if (!token || !userDetails.id) {
      setInviteStatus("Missing token or user ID");
      return;
    }

    try {
      setInviteLoading(true);
      setInviteStatus("");

      const res = await fetch("http://localhost:8000/invite/invites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invited_user_id: userDetails.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInviteStatus("Invitation sent successfully!");
      } else {
        setInviteStatus(`Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setInviteStatus(`Network error: ${err.message}`);
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Button onClick={onBack}>Back</Button>

          <Title level={3} style={{ marginBottom: 0 }}>
            Search Results
          </Title>

          {loading && <Spin tip="Searching..." />}
          {errorMsg && <Alert type="error" message={errorMsg} showIcon />}

          {searchResults && (
            <Card
              style={{
                textAlign: "left",
                background: "#fff",
                marginTop: 8,
              }}
            >
              {userExists ? (
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text>
                    <strong>Name:</strong> {userDetails.first_name || "N/A"}{" "}
                    {userDetails.last_name || ""}
                  </Text>
                  <Text>
                    <strong>Phone:</strong> {userDetails.country_code}{" "}
                    {userDetails.phone}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {userDetails.email || "N/A"}
                  </Text>
                  <Text>
                    <strong>Slug:</strong> {userDetails.slug_name}
                  </Text>
                  <Text>
                    <strong>ID:</strong> {userDetails.id}
                  </Text>

                  <Button
                    type="primary"
                    onClick={handleInvite}
                    loading={inviteLoading}
                    block
                  >
                    Invite / Start Chat
                  </Button>

                  {inviteStatus && (
                    <Alert
                      style={{ marginTop: 8 }}
                      type={
                        inviteStatus.toLowerCase().includes("success")
                          ? "success"
                          : "error"
                      }
                      message={inviteStatus}
                      showIcon
                    />
                  )}
                </Space>
              ) : (
                <Text type="secondary">User does not exist</Text>
              )}
            </Card>
          )}
        </Space>
      </Content>
    </Layout>
  );
}
