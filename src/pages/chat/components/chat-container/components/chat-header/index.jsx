import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "../../../../../../lib/utils";
import { HOST } from "../../../../../../utils/constants";

const ChatHeader = () => {
  const { closeChat, SelectedChatData, SelectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-center px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {SelectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}${SelectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center ${getColor(
                    SelectedChatData.color
                  )}`}
                >
                  {SelectedChatData.firstName
                    ? SelectedChatData.firstName.split("").shift()
                    : SelectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {SelectedChatType === "contact" && SelectedChatData.firstName
              ? `${
                  SelectedChatData.firstName + " " + SelectedChatData.lastName
                }`
              : SelectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
