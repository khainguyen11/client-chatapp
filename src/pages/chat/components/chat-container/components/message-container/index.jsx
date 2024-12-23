import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { apiClient } from "../../../../../../lib/api-client";
import { GET_MESSAGES, HOST } from "../../../../../../utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
const MessageContainer = () => {
  const downloadFile = async (file) => {
    const response = await apiClient.get(`${HOST}${file}`, {
      responseType: "blob",
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = urlBlob;
    console.log(link);

    link.setAttribute("download", file.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  };
  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };
  const scrollRef = useRef();
  const {
    SelectedChatType,
    SelectedChatData,
    UserInfo,
    SelectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();
  useEffect(() => {
    const getMessages = async () => {
      console.log("vao getmessages");

      try {
        const response = await apiClient.post(
          GET_MESSAGES,
          { id: SelectedChatData._id },
          { withCredentials: true }
        );
        console.log(response);

        if (response.data) {
          console.log("lay data mess");

          setSelectedChatMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (SelectedChatData._id && SelectedChatType === "contact") {
      getMessages();
    }
  }, [SelectedChatData, SelectedChatType]);
  const renderMessages = () => {
    let lastDate = null;
    return SelectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {SelectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.recipient === SelectedChatData._id
            ? "text-right"
            : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.recipient === SelectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.recipient === SelectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer">
                <img
                  src={`${HOST}${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [SelectedChatMessages]);
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
