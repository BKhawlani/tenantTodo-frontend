import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import "../components/Dashboard/dashboard.css";

function Invitations() {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    async function loadInvites() {
      const res = await api.get("/task/share/invites");
      setInvites(res.data);
    }
    loadInvites();
  }, []);

  const accept = async (id) => {
    await api.post(`/task/share/accept/${id}`);
    setInvites((p) => p.filter((i) => i.id !== id));
  };

  const reject = async (id) => {
    await api.post(`/task/share/reject/${id}`);
    setInvites((p) => p.filter((i) => i.id !== id));
  };

  return (
    <Layout>
      <h1>Task Invitations</h1>

      {invites.length === 0 ? (
        <p>No invitations</p>
      ) : (
        invites.map((inv) => (
          <div key={inv.id} className="invite-card">
            <h3>{inv.Task.title}</h3>
            <p>{inv.Task.description}</p>
            <p><b>Shared by:</b> {inv.fromUserId}</p>

            <button onClick={() => accept(inv.id)}>Accept</button>
            <button onClick={() => reject(inv.id)}>Reject</button>
          </div>
        ))
      )}

    </Layout>
  );
}

export default Invitations;
