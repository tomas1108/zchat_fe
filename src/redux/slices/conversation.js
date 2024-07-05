import { createSlice } from "@reduxjs/toolkit";

import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";

const user_id = window.localStorage.getItem("user_id");
const date = new Date();
const hours = date.getHours();
const minutes = date.getMinutes();
const time = `${hours}:${minutes}`;

function isLink(str) {
  // Biểu thức chính quy để kiểm tra xem chuỗi có phải là một liên kết hay không
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  // Kiểm tra xem chuỗi có khớp với biểu thức chính quy không
  return regex.test(str);
}




const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  current_chat: [],


};



const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // tải danh sách tin nhắn lên
    fetchDirectConversations1(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        const about = {
          sex: user?.gender,
          birthday: user?.birthDate,
          email: user?.email,
        };
        
        // Get the last message from the messages array
        const lastMessage = el.messages[el.messages.length - 1];
        const lastToLastMessage = el.messages[el.messages.length - 2];
        console.log("lastToLastMessage", lastToLastMessage)
        console.log("lastMessage", lastMessage)
        let messageText = lastMessage?.text || "";
        let unreadCount = 0;
        let unreadTo = "";
        const friend_name = user?.firstName + " " + user?.lastName;
        const isMessageFromSender = lastMessage?.from === user?._id;
        
        if(lastMessage?.type === "Timeline") {
          messageText = lastToLastMessage;
        }

        if (lastMessage?.type === "Notice") {
          messageText = `You and ${user?.firstName} connected`;
          unreadTo = unreadCount = null;
        } else if (lastMessage?.from === user_id) {
          // Nếu tin nhắn là từ người dùng hiện tại
          if (lastMessage?.type === "Image") {
            messageText = "You sent a photo";
          } else if (lastMessage?.type === "Link") {
            messageText = "You sent a link";
          }
          else if (lastMessage?.type === "Document") {
            messageText = "You sent a document";
          }
          else if (lastMessage?.type === "Voice") {
            messageText = "You sent a voice";  
          } else {
            messageText = "You: " + messageText;
          } 
      
        } else {
          // Tin nhắn từ người khác
          if (lastMessage?.type === "Image") {
            messageText = "Sent you a photo";
          } else if (lastMessage?.type === "Link") {
            messageText = "Sent you a link"
          }
          else if (lastMessage?.type === "Document") {
            messageText = "Sent you a document";
          }
          else if (lastMessage?.type === "Voice") {
            messageText = "Sent you a voice";
          } else {
            messageText = messageText;
          }
          // Tính số lượng tin nhắn chưa đọc nếu tin nhắn không phải là notice và không phải từ người dùng hiện tại
          unreadCount = el.messages.filter((message) => message.from !== user_id && !message.read).length;
          unreadTo = unreadCount.toString();
        }

        // Định dạng thời gian và so sánh với ngày hiện tại
        // const messageTime = parseDateTime(lastMessage?.time);
        // console.log("messageTime", messageTime);
        // const hours = String(messageTime.getHours()).padStart(2, '0');
        // const minutes = String(messageTime.getMinutes()).padStart(2, '0');
        // const currentTime = new Date();

        // let formattedTime = `${hours}:${minutes}`;;

        // const dayDifference = getDayDifference(currentTime, messageTime);


        // if (dayDifference > 0) {
        //   formattedTime = `${dayDifference} days`;
        // }
        // else{
        //   formattedTime = `${hours}:${minutes}`;
        // }

        return {
          id: el._id,
          user_id: user?._id,
          name: friend_name,
          online: user?.status,
          img: user?.avatar,
          msg: messageText,
          time: lastMessage?.time || time,
          unread: 0, // Convert the unread count to string for consistency
          pinned: false,
          about: about,
        };
      });
      state.direct_chat.conversations = list;
    },
    
    fetchDirectConversations(state, action) {
      const user_id = window.localStorage.getItem("user_id");
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find((elm) => elm._id.toString() !== user_id);
        const about = {
          sex: user?.gender,
          birthday: user?.birthDate,
          email: user?.email,
        };
    
        // Lấy tin nhắn cuối cùng và tin nhắn trước đó
        const lastMessage = el.messages[el.messages.length - 1];
        const lastToLastMessage = el.messages[el.messages.length - 2];
    
        let messageText = lastMessage?.text || "";
        let unreadCount = 0;
        let unreadTo = "";
        const friend_name = user?.firstName + " " + user?.lastName;
    
        // Nếu tin nhắn cuối cùng là Timeline, sử dụng tin nhắn trước đó
        if (lastMessage?.type === "Timeline" && lastToLastMessage) {
          messageText = lastToLastMessage?.text || "";
          if (lastToLastMessage?.from === user_id) {
            if (lastToLastMessage?.type === "Image") {
              messageText = "You: sent a photo";
            } else if (lastToLastMessage?.type === "Link") {
              messageText = "You: sent a link";
            } else if (lastToLastMessage?.type === "Document") {
              messageText = "You: sent a document";
            } else if (lastToLastMessage?.type === "Voice") {
              messageText = "You: sent a voice";
            } else {
              messageText = "You: " + lastToLastMessage?.text;
            }
          } else {
            if (lastToLastMessage?.type === "Image") {
              messageText = "Sent you a photo";
            } else if (lastMessage?.type === "Link") {
              messageText = "Sent you a link";
            } else if (lastToLastMessage?.type === "Document") {
              messageText = "Sent you a document";
            } else if (lastToLastMessage?.type === "Voice") {
              messageText = "Sent you a voice";
            } else {
              messageText = lastToLastMessage?.text;
            }
            unreadCount = el.messages.filter((message) => message.from !== user_id && !message.read).length;
            unreadTo = unreadCount.toString();
          }
        } else if (lastMessage?.type === "Notice") {
          messageText = `You and ${user?.firstName} connected`;
          unreadTo = unreadCount = null;
        } else if (lastMessage?.from === user_id) {
          if (lastMessage?.type === "Image") {
            messageText = "You sent a photo";
          } else if (lastMessage?.type === "Link") {
            messageText = "You sent a link";
          } else if (lastMessage?.type === "Document") {
            messageText = "You sent a document";
          } else if (lastMessage?.type === "Voice") {
            messageText = "You sent a voice";
          } else {
            messageText = "You: " + messageText;
          }
        } else {
          if (lastMessage?.type === "Image") {
            messageText = "Sent you a photo";
          } else if (lastMessage?.type === "Link") {
            messageText = "Sent you a link";
          } else if (lastMessage?.type === "Document") {
            messageText = "Sent you a document";
          } else if (lastMessage?.type === "Voice") {
            messageText = "Sent you a voice";
          } else {
            messageText = messageText;
          }
          unreadCount = el.messages.filter((message) => message.from !== user_id && !message.read).length;
          unreadTo = unreadCount.toString();
        }
    
        return {
          id: el._id,
          user_id: user?._id,
          name: friend_name,
          online: user?.status,
          img: user?.avatar,
          msg: messageText,
          time: lastMessage?.time || time,
          unread: unreadCount, // Chuyển đổi số lượng tin nhắn chưa đọc thành chuỗi để đồng nhất
          pinned: false,
          about: about,
        };
      });
      state.direct_chat.conversations = list;
    },
    // cập nhật cuộc trò chuyện trực tiếp với dữ liệu mới nhận được từ server
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status,
              img: user?.avatar,
              msg: this_conversation.messages.slice(-1)[0].text,
              time: time,
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    // thêm cuộc trò chuyện trực tiếp mới vào danh sách cuộc trò chuyện
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      const message = this_conversation.messages.slice(-1)[0].text;

      console.log("message add", message);
      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status,
        img: user?.avatar,
        msg: "You and " + user?.firstName + " connected",
        time: time,
        unread: 0,
        pinned: false,
      });
    },
    // cập nhật cuộc trò chuyện hiện tại
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    // tải tin nhắn hiện tại lên
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      // console.log("tin nhắn fect", messages);
      if (!Array.isArray(messages)) return; // Kiểm tra xem messages là một mảng hay không
      // const formatted_messages = messages.map((el) => ({
      //   id: el.id,
      //   type: "msg",
      //   subtype: el.type,
      //   message: el.text,
      //   time: el.created_at,
      //   incoming: el.to === user_id,
      //   outgoing: el.from === user_id,

      state.direct_chat.current_messages = messages;
    },
    // Cập nhật danh sách cuộc trò chuyện với dữ liệu mới nhận được từ server
    updateDirectConversations1(state, action) {
      const { message, conversation_id } = action.payload;
      const user_id = window.localStorage.getItem("user_id");

      console.log("message state", message); // Kiểm tra message trong console
      console.log("conversation_id", conversation_id); // Kiểm tra conversationId trong console

      // Cập nhật danh sách các cuộc trò chuyện
      state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
        if (el?.id !== conversation_id) {
          return el;
        } else {
          if (message.from === user_id) {
            if (message.type === "Text") {
      
              // Tin nhắn từ người dùng hiện tại
              return {
                ...el,
                msg: `You: ${message.text}`,
                time: message.created_at,
                unread: 0
              };

            }
            else if (message.type === "Image") {
              return {
                ...el,
                msg: `You: sent a photo`,
                time: message.created_at,
                unread: 0
              };
            }

            else if (message.type === "Document") {
              return {
                ...el,
                msg: `You: sent a document`,
                time: message.created_at,
                unread: 0
              };
            }

            else if (message.type === "Voice") {
              return {
                ...el,
                msg: `You: sent a voice`,
                time: message.created_at,
                unread: 0
              };
            }
            else if (message.type === "Link") {
              return {
                ...el,
                msg: `You: sent a link`,
                time: message.created_at,
                unread: 0
              };
            }
            else if (message.type === "TimeLine"){
              return null;
            }
          } else {
            // Tin nhắn từ người dùng khác
            if (message.type === "Text") {
              return {
                ...el,
                msg: message.text,
                time: message.created_at,
                unread: el.unread + 1,
              };
            }
            else if (message.type === "Image") {
              return {
                ...el,
                msg: "Sent you a photo",
                time: message.created_at,
                unread: el.unread + 1,
              };
            }
            else if (message.type === "Document") {
              return {
                ...el,
                msg: "Sent you a document",
                time: message.created_at,
                unread: el.unread + 1,
              };
            }
            else if (message.type === "Voice") {
              return {
                ...el,
                msg: "Sent you a voice",
                time: message.created_at,
                unread: el.unread + 1,
              };
            }
            else if (message.type === "Link") {
              return {
                ...el,
                msg: "Sent you a link",
                time: message.created_at,
                unread: el.unread + 1,
              };
          }
        }

        }
      });

      // Nếu cuộc trò chuyện hiện tại là cuộc trò chuyện nhận được tin nhắn mới, cập nhật nó luôn
      if (state.direct_chat.current_conversation.id === conversation_id) {
        if (message.from === user_id ) {
          state.direct_chat.current_conversation = {
            ...state.direct_chat.current_conversation,
            msg: `You: ${message.text}`,
            time: message.created_at,
          };
        } else {
          state.direct_chat.current_conversation = {
            ...state.direct_chat.current_conversation,
            msg: message.text,
            time: message.created_at,
            unread: state.direct_chat.current_conversation.unread + 1,
          };
        }
      }
    },
    updateDirectConversations(state, action) {
      const { message, conversation_id } = action.payload;
      const user_id = window.localStorage.getItem("user_id");
      const current_messages = state.direct_chat.current_messages;
    
      console.log("message current", current_messages); // Kiểm tra message trong console
      console.log("message state", message); // Kiểm tra message trong console
      console.log("conversation_id", conversation_id); // Kiểm tra conversationId trong console
    
      // Cập nhật danh sách các cuộc trò chuyện
      state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
        if (el?.id !== conversation_id) {
          return el;
        } else {
          if (message.type === "Timeline") {
            // Không thay đổi gì nếu là TimeLine
            console.log(el, "TimeLine")
            return el;
          }
    
          if (message.from === user_id) {
            let msg = '';
            switch (message.type) {
              case 'Text':
                msg = `You: ${message.text}`;
                break;
              case 'Image':
                msg = 'You sent a photo';
                break;
              case 'Document':
                msg = 'You sent a document';
                break;
              case 'Voice':
                msg = 'You sent a voice';
                break;
              case 'Link':
                msg = 'You sent a link';
                break;
              default:
                break;
            }
            return {
              ...el,
              msg: msg,
              time: message.created_at,
              unread: 0
            };
          } else {
            let msg = '';
            switch (message.type) {
              case 'Text':
                msg = message.text;
                break;
              case 'Image':
                msg = 'Sent you a photo';
                break;
              case 'Document':
                msg = 'Sent you a document';
                break;
              case 'Voice':
                msg = 'Sent you a voice';
                break;
              case 'Link':
                msg = 'Sent you a link';
                break;
              default:
                break;
            }
            return {
              ...el,
              msg: msg,
              time: message.created_at,
              unread: el.unread + 1,
            };
          }
        }
      });
    
      // Nếu cuộc trò chuyện hiện tại là cuộc trò chuyện nhận được tin nhắn mới, cập nhật nó luôn
      if (state.direct_chat.current_conversation.id === conversation_id) {
        if (message.type !== "TimeLine") {
          let msg = message.from === user_id ? `You: ${message.text}` : message.text;
          state.direct_chat.current_conversation = {
            ...state.direct_chat.current_conversation,
            msg: msg,
            time: message.created_at,
            unread: message.from !== user_id ? state.direct_chat.current_conversation.unread + 1 : state.direct_chat.current_conversation.unread,
          };
        }
      }
    },
    // cập nhật trạng thái trực tuyến của người dùng
    updateUserStatus(state, action) {
      const { user_id, status } = action.payload;
      state.direct_chat.conversations = state.direct_chat.conversations.map((el) => {
        if (el?.user_id !== user_id) {
          return el;
        } else {
          return {
            ...el,
            online: status,
          };
        }
      });
    },
    updateCurrentMessages(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
    updateReactions(state, action) {
      const { message_id, reactions } = action.payload;
      state.direct_chat.current_messages = state.direct_chat.current_messages.map((el) => {
       
        if (el._id === message_id) {
          
          return {
            ...el,
            reactions: reactions,
          };
        } else {
          return el;
        }
      });
    }
    

  },
  addDirectMessage(state, action) {
    state.direct_chat.current_messages.push(action.payload.message);
  }


});

export default slice.reducer;
// ----------------------------------------------------------------------


export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};


export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};



export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  }
}
export const UpdateDirectConversations = (data) => {
  console.log("Dispatching UpdateDirectConversations with data:", data);
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversations(data));
  };
};


export const UpdateCurrentMessages = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateCurrentMessages({ message }));
  };
}

export const UpdateUserStatus = ({ user_id, status }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateUserStatus({ user_id, status }));
  };
};

export const UpdateReactions = ({ message_id, reactions }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateReactions({ message_id, reactions }));
  };
};