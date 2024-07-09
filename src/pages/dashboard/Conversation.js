import { Stack, Box, Typography, CircularProgress, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { Chat_History } from "../../data";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";

import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  Notice,
  ReplyMsg,
  TextMsg,
  Timeline,
  VoiceMsg,
} from "../../sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  AddDirectMessage,
  FetchCurrentMessages,
  SetCurrentConversation,

} from "../../redux/slices/conversation";
import { socket } from "../../socket";
import ScrollbarCustom from "../../components/ScrollbarCustom";
import { ArrowDownward } from "@mui/icons-material";
const Conversation = ({ isMobile, menu, loadedMessagesCount, loading }) => {
  const dispatch = useDispatch();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);
  const [messageSent, setMessageSent] = useState(false);
  const { user_id } = useSelector((state) => state.auth);
  const [sent, setSent] = useState(false);
  const [seen, setSeen] = useState(false);



  const [initialFetchDone, setInitialFetchDone] = useState(false); // State để chỉ fetch tin nhắn lần đầu
  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      dispatch(FetchCurrentMessages({ messages: data }));
    });

    dispatch(SetCurrentConversation(current));
  }, [room_id, conversations, dispatch]);


  /// lấy tin nhắn cuối cùng của current_messages từ from

  // useEffect(() => {
  //   // Find the last message from user_id in current_messages
  //   const lastMessage = current_messages.find((msg) => msg.from === user_id);
  //   setLastMessageFromUser(lastMessage);
  // }, [current_messages, user_id]);

  // // Lấy tin nhắn cuối cùng
  // const lastMessage = current_messages[current_messages.length - 1];
  // // console.log("lastMessage", lastMessage);

  const tenMessages = current_messages.slice(-loadedMessagesCount);












  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {loading && (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {tenMessages.map((el, idx) => (

          // console.log("chat", current_messages , el),

          <React.Fragment key={idx}>
            {(() => {
              switch (el.type) {
                case "Notice":
                  // thông báo
                  return <Notice el={el} />
                case "Timeline":
                  // thông báo
                  return <Timeline el={el} />
                case "Text":
                  // tin nhắn văn bản
                  return <TextMsg el={el} menu={menu} />;
                case "Image":
                  // hình ảnh  
                  return <MediaMsg el={el} menu={menu} />
                case "Document":
                  // tài liệu
                  return <DocMsg el={el} menu={menu} />
                case "Voice":
                  return <VoiceMsg el={el} menu={menu} />
                default:
                  return <TextMsg el={el} menu={menu} />;
              }
            })()}
          </React.Fragment>
        ))}

        {/* {sent && (
          <Box display="flex" justifyContent="flex-end">
            {seen === true ? (
              <Typography variant="caption" color="textSecondary" sx={{ marginTop: '-18px' }}>
                Seen
              </Typography>
            ) : (
              <Typography variant="caption" color="textSecondary" sx={{ marginTop: '-18px' }}>
                Sent
              </Typography>
            )}

          </Box>
        )} */}


      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const messageListRef = useRef(null);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { current_messages } = useSelector((state) => state.conversation.direct_chat);
  const [loadedMessagesCount, setLoadedMessagesCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    socket.on("typing", ({ userId, conversationId }) => {
      if (room_id === conversationId && userId !== current_conversation?.user_id) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }

      // Clear typing indicator after a delay
      setTimeout(() => setIsTyping(false), 2000); 
    });
   
    return () => {
      socket.off("typing");
    };
  }, [room_id, current_conversation?.user_id]);


  
  const handleScroll = useCallback(
    (values) => {
      const { scrollTop, scrollHeight, clientHeight } = values;
      const threshold = 50; // Khoảng cách từ đỉnh

      if (scrollTop > 0 && scrollTop <= threshold && !loading) {
        setLoading(true);
        setTimeout(() => {
          setLoadedMessagesCount((prevCount) => prevCount + 10);
          setLoading(false);
        }, 1000); // Giả lập độ trễ 1 giây
      }
      // Hiển thị nút xuống nếu cuộn lên trên một ngưỡng nhất định
      if (scrollTop < scrollHeight - clientHeight - threshold) {
        setShowScrollDown(true);
      } else {
        setShowScrollDown(false);
      }

    },
    [loading]
  );

  useEffect(() => {
    setLoadedMessagesCount(10);
    setLoading(false);
  }, [current_conversation]);




  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollToBottom();
    }
  };


  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={isMobile ? "100vw" : "auto"}>
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          backgroundColor:
            theme.palette.mode === "light" ? "#F0F4FA" : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",

        }}

      >
        <ScrollbarCustom autoHeightMin="78vh" onScrollFrame={handleScroll} ref={messageListRef}>
          <Conversation
            menu={true}
            isMobile={isMobile}
            loadedMessagesCount={loadedMessagesCount}
            loading={loading}
          />
        </ScrollbarCustom>
        {showScrollDown && (
          <Box
            position="absolute"
            bottom={16}
            left="50%" // Center horizontally
            transform="translateX(-50%)" // Adjust for the button's width
            zIndex={1}
          >
            <Tooltip title="Scroll to bottom" arrow>
              <IconButton color="primary" onClick={scrollToBottom}>
                <ArrowDownward />
              </IconButton>
            </Tooltip>

          </Box>
        )}
        <Box
          position="absolute"
          bottom={1}
          left="0.5%" // Center horizontally
          transform="translateX(-50%)" // Adjust for the button's width
          zIndex={1}
        >
          {isTyping && (
            <Typography variant="caption" color="textSecondary" sx={{ textAlign: "center" }}>
              {current_conversation?.name} is typing... 
            </Typography>
          )}
        </Box>


      </Box>

      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
