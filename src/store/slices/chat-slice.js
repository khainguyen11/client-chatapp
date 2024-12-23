export const createChatSlice = (set, get) => ({
  SelectedChatType: undefined,
  SelectedChatData: undefined,
  SelectedChatMessages: [],
  directMessagesContacts: [],

  setSelectedChatType: (SelectedChatType) => set({ SelectedChatType }),

  setSelectedChatData: (SelectedChatData) => set({ SelectedChatData }),

  setSelectedChatMessages: (SelectedChatMessages) =>
    set({ SelectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  closeChat: () =>
    set({
      SelectedChatData: undefined,
      SelectedChatType: undefined,
      SelectedChatMessages: [],
    }),

  addMessage: (message) => {
    const SelectedChatMessages = get().SelectedChatMessages;
    const SelectedChatType = get().SelectedChatType; // Fix this line to get the value of SelectedChatType
    set({
      SelectedChatMessages: [
        ...SelectedChatMessages, // Spread the existing messages
        {
          ...message,
          recipient:
            SelectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            SelectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
        },
      ],
    });
  },
});
