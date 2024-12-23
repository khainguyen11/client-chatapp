import { Avatar, AvatarImage } from "./ui/avatar";
import { useAppStore } from "../store";
import { getColor } from "../lib/utils";
import { HOST } from "../utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    SelectedChatData,
    setSelectedChatData,
    SelectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contacts) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else setSelectedChatType("contact");
    setSelectedChatData(contacts);
    if (SelectedChatData && SelectedChatData._id === contacts._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-200 cursor-pointer ${
            SelectedChatData && SelectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={` ${
                      SelectedChatData && SelectedChatData._id === contact._id
                        ? "bg-[ffffff22] border-2 border-white/50"
                        : getColor(contact.color)
                    }uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
