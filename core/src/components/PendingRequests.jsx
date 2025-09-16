import { useEffect, useState } from "react";
import {
  Card,
  List,
  Avatar,
  Tag,
  Dropdown,
  Menu,
  message,
  Modal,
  Spin,
  Empty,
} from "antd";

export default function InvitedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem("authData") || "null");
  const token = authData?.access_token;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:8000/invite/get_invitation_request", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => setRequests(json.data?.invitation_request || []))
      .catch(() => message.error("Failed to load requests"))
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/invite/invites/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      message.success(`Invitation ${newStatus.toLowerCase()}`);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus.toLowerCase() } : req
        )
      );
    } catch (err) {
      message.error("Error updating invitation");
    }
  };

  const confirmUpdate = (id, status) => {
    Modal.confirm({
      title: `Confirm ${status}?`,
      content: `Are you sure you want to mark this request as ${status}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => updateStatus(id, status),
    });
  };

  const renderStatus = (item) => {
    if (item.status === "pending") {
      const menu = (
        <Menu
          onClick={({ key }) => confirmUpdate(item.id, key)}
          items={[
            { key: "ACCEPTED", label: "Accept" },
            { key: "DECLINED", label: "Decline" },
          ]}
        />
      );
      return (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Tag color="orange" style={{ cursor: "pointer" }}>
            Pending
          </Tag>
        </Dropdown>
      );
    }

    return (
      <Tag color={item.status === "accepted" ? "green" : "red"}>
        {item.status}
      </Tag>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <Card
        title="Invitation Requests"
        style={{ width: "100%", maxWidth: 600 }}
        bordered={false}
      >
        {loading ? (
          <Spin tip="Loading requests..." style={{ display: "block", textAlign: "center" }} />
        ) : requests.length === 0 ? (
          <Empty description="No invitation requests" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={requests}
            renderItem={(item) => (
              <List.Item actions={[renderStatus(item)]}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.user_info?.profile_image}>
                      {item.user_info?.first_name?.[0]}
                    </Avatar>
                  }
                  title={`${item.user_info?.first_name ?? ""} ${
                    item.user_info?.last_name ?? ""
                  }`}
                  description={`${item.user_info?.country_code ?? ""} ${
                    item.user_info?.phone ?? ""
                  }`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
