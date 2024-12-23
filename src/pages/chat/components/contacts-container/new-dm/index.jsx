import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "../../../../../lib/utils";
import { apiClient } from "../../../../../lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "../../../../../utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "../../../../../store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContacted, setSearchContact] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    searchContacts(searchTerm);
  }, [searchTerm]);
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          {
            searchTerm,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          console.log(response.data.contacts);
          setSearchContact(response.data.contacts);
        }
      } else {
        setSearchContact([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const SelectNewContact = (contact) => {
    console.log(contact);

    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchContact([]);
    setSearchTerm("");
  };
  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400ox] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchContacted.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchContacted.map((contact) => {
                  return (
                    <div
                      key={contact._id}
                      className="flex gap-3 items-center cursor-pointer "
                      onClick={() => {
                        SelectNewContact(contact);
                      }}
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}${contact.image}`}
                              alt="profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.split("").shift()
                                : contact.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {" "}
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : `${contact.email}`}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
          {searchContacted.length <= 0 && !searchTerm ? (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-100 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search new{" "}
                  <span className="text-purple-500">Contact.</span>
                </h3>
              </div>
            </div>
          ) : (
            <h3>No Contact with that name</h3>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default NewDM;
