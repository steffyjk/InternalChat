import { useState } from "react";
import { Form, Input, Button, Typography, Card, Space } from "antd";

const { Title, Text } = Typography;

export default function Home({ onSendOtp, loading, error }) {
  const [phone, setPhone] = useState("");
  const [country] = useState("+91");

  const handleFinish = () => {
    onSendOtp(phone, country);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "12px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "16px",
        }}
        bordered={false}
      >
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Title level={3} style={{ marginBottom: 0 }}>
            Welcome to Skynect
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Enter your phone number to receive an OTP
          </Text>

          <Form onFinish={handleFinish} layout="vertical" style={{ marginTop: 8 }}>
            <Form.Item style={{ marginBottom: 12 }}>
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={!phone}
              >
                Connect Now
              </Button>
            </Form.Item>

            {error && (
              <Text type="danger" style={{ fontSize: 13 }}>
                {error}
              </Text>
            )}
          </Form>
        </Space>
      </Card>
    </div>
  );
}
