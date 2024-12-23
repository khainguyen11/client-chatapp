import { useEffect } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, SelectedChatType, SelectedChatData } = useAppStore();
  const navigate = useNavigate();
  console.log("vao that roi nay");

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer></ContactContainer>
      {SelectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
      {/* <EmptyChatContainer></EmptyChatContainer> */}
      {/* <ChatContainer></ChatContainer> */}
    </div>
  );
};

export default Chat;
