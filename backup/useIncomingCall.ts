import { useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { socket } from "../../lib/socket";

type Incoming = {
  callId: string;
  from: {
    idUser: string;
    username: string;
  };
};

export function useIncomingCall() {
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState<Incoming | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onIncoming = (payload: any) => {
      setIncoming(payload);
    };

    const onCancelled = () => {
      setIncoming(null);
      message.info("Call cancelled");
    };

    const onRejected = () => {
      message.info("Call rejected");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFailed = (reason: any) => {
      if (reason === "offline") {
        message.error("User is offline");
      } else {
        message.error("Call failed");
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onAccepted = (roomId: string, role: any) => {
      const me = getUserId();

      if (role === "owner") {
        socket.emit("room:create", {
          roomId,
          user: { idUser: me, username: null },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleCreate = (room: any) => {
          if (room.roomId === roomId) {
            socket.off("room:created", handleCreate);
            navigate(`/meeting/room/${roomId}`);
          }
        };

        socket.on("room:created", handleCreate);
      } else {
        navigate(`/meeting/room/${roomId}`);
      }
    };

    socket.on("call:incoming", onIncoming);
    socket.on("call:cancelled", onCancelled);
    socket.on("call:rejected", onRejected);
    socket.on("call:failed", onFailed);
    socket.on("call:accepted", onAccepted);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:cancelled", onCancelled);
      socket.off("call:rejected", onRejected);
      socket.off("call:failed", onFailed);
      socket.off("call:accepted", onAccepted);
    };
  }, [navigate]);

  const callUser = (toUserId: string) => {
    socket.emit("call:request", { toUserId });
  };

  const accept = () => {
    if (!incoming) return;

    socket.emit("call:accept", {
      callId: incoming.callId,
      accept: true,
    });

    setIncoming(null);
  };

  const reject = () => {
    if (!incoming) return;

    socket.emit("call:accept", {
      callId: incoming.callId,
      accept: false,
    });

    setIncoming(null);
  };

  return {
    incoming,
    callUser,
    accept,
    reject,
  };
}
