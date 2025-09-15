import { useEffect, useState } from "react";
import { Card, List, Avatar, Tag, Dropdown, Menu, message, Modal } from "antd";

export default function InvitedRequests() {
  const [requests, setRequests] = useState([]);
const authData = JSON.parse(localStorage.getItem("authData"));
  const token = authData?.access_token;
  useEffect(() => {
    fetch("http://localhost:8000/invite/get_invitation_request", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => setRequests(json.data.invitation_request || []));
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
      // update UI instantly
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
          <Tag color="orange" className="cursor-pointer">
            Pending ⬇
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
    <div className="p-6 flex justify-center">
      <Card title="Invitation Requests" className="w-full max-w-2xl shadow-lg">
        <List
          itemLayout="horizontal"
          dataSource={requests}
          renderItem={(item) => (
            <List.Item actions={[renderStatus(item)]}>
              <List.Item.Meta
                avatar={
                  <Avatar src={item.user_info.profile_image || undefined}>
                    {item.user_info.first_name?.[0]}
                  </Avatar>
                }
                title={`${item.user_info.first_name ?? ""} ${
                  item.user_info.last_name ?? ""
                }`}
                description={`${item.user_info.country_code} ${item.user_info.phone}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
