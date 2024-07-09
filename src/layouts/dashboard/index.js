import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation, showSnackbar } from "../../redux/slices/app";
import { socket, connectSocket } from "../../socket";
import {
  UpdateDirectConversation,
  AddDirectConversation,
  AddDirectMessage,
  UpdateCurrentMessages,
  FetchDirectConversations,
  UpdateDirectConversations,
  UpdateUserStatus,
  UpdateReactions,
} from "../../redux/slices/conversation";
import { addNotification, pushNotification, removeNotification } from "../../redux/slices/notification";
import { playNotificationSound } from "../../utils/playsound";
import { playMuisic } from "../../components/MusicPlayer";
import { ConstructionOutlined } from "@mui/icons-material";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { user_email } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.list);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  let status;
  const { playSound } = useSelector((state) => state.notifications);
  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";

        }
        // Đánh dấu trang đã được tải một lần

      }
      window.onload();
      if (!socket) {
        connectSocket(user_id);
        console.log("Connect socket to server by user_id: ", user_id);
      }
      socket.on("new_message", (data) => {
        const message = data.message;
        console.log("current_conversation login ", data);
        // check if msg we got is from currently selected conversation
        dispatch(UpdateCurrentMessages(data.message));
        dispatch(UpdateDirectConversations(data));
      });
      socket.on("received", (data) => {
        if(playSound === true){
          console.log("tao phát");
          /// nếu status = true thì mới thông báo 
        playMuisic("Tieng-dang-soan-tin-nhan-messenger-www_tiengdong_com (mp3cut.net).mp3");
        }else{
          console.log("không phát");
        }

        
      });
      socket.on("start_chat", (data) => {
        console.log("Start chat with ", data);
        // add / update to conversation list
        if (Array.isArray(conversations)) {
          const existing_conversation = conversations.find(
            (el) => el?.id === data._id
          );
          console.log("existing", conversations);
          if (existing_conversation) {
            // update direct conversation
            dispatch(UpdateDirectConversation({ conversation: data }));
            
          } else {
            // add direct conversation
            dispatch(AddDirectConversation({ conversation: data }));
          }
          dispatch(SelectConversation({ room_id: data._id }));
          //dispatch(SelectConversation({ room_id: roomID }));
        } else {
          console.error('Conversations is not an array.');
        }
      });
      socket.on("request_sent", (data) => {
        console.log("Request sent", data);
        dispatch(showSnackbar({
          severity: "success",
          message: "Request Sent successfully"
        }));
      });
      socket.on("new_friend_request", (data) => {
        console.log("New friend request", data);
        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message
          }));
        const newNotification = {
          id: data.id,
          message: data.message,
          time: data.time,
          avatar: data.avatar,
          seen: false,
          from: data.from
        };
        console.log("New notification", newNotification);
        dispatch(pushNotification(newNotification));

      });
      socket.on("request_accepted", (data) => {

        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message,
          })
        );
        const newNotification = {
          id: data.id,
          message: data.message,
          time: data.time,
          avatar: data.avatar,
          seen: false,
          from: data.from
        };
        dispatch(pushNotification(newNotification));
      });
      socket.on("friend_cancel", (data) => {
        dispatch(
          showSnackbar({
            severity: "error",
            message: data.message,
          })
        );
        dispatch(removeNotification(
          {
            message: "sent you a friend request",
            fromId: data.from
          }
        )
        );
      }
      );

      socket.on("reaction_updated", (data) => {
        dispatch(UpdateReactions({
          message_id: data.message_id,
          reactions: data.reactions
        }));
      
      });
      socket.on("user_offline", (data) => {
        console.log("User offline", data);
        dispatch(
          UpdateUserStatus({ user_id: data.user_id, status: data.status })
        );
      });
      socket.on("user_online", (data) => {
        dispatch(
          UpdateUserStatus({ user_id: data.user_id, status: data.status })
        );
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat");
      socket?.off("new_message");
      socket?.off("friend_cancel");
      socket?.off("user_offline");
      socket?.off("user_online");
      socket?.off("received");
      socket?.off("reaction_updated");

    };
  // }, [isLoggedIn, socket]);
  }, [isLoggedIn,  conversations, current_conversation, user_id, playSound, dispatch]);
  // }, [isLoggedIn, notifications.length, conversations, current_conversation, user_id, user_email, dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack direction="row">
        {isDesktop && (
          // SideBar
          <SideNav />
        )}
        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;