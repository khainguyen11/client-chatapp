import { Children, createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { HOST } from "../utils/constants";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      console.log("vao day");

      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
    }
    console.log("vao cai nay");

    const handleRecieveMessage = (message) => {
      const { SelectedChatData, SelectedChatType, addMessage } =
        useAppStore.getState();
      console.log(message);

      if (
        (SelectedChatType !== undefined &&
          SelectedChatData._id === message.sender._id) ||
        SelectedChatData._id === message.recipient._id
      ) {
        console.log(message);

        addMessage(message);
      }
    };

    if (socket.current) {
      socket.current.on("recieveMessage", handleRecieveMessage);
    }

    return () => {
      if (socket.current) {
        console.log("clear");

        socket.current.disconnect();
      }
    };
  }, [userInfo]);
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
