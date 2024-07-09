import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Camera, File, FileVideo, Gif, Image, LinkSimple, PaperPlaneTilt, Smiley, Sticker, User } from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket";

import S3 from "../../utils/s3";
import { Mic, Stop, VideoFile } from "@mui/icons-material";
import uploadFileToFirebase from "../../utils/firebase";
import { dateTime } from "../../utils/dateTime";
import conversation from "../../redux/slices/conversation";


const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    paddingTop: '12px !important',
    paddingBottom: '12px !important',
  },
  '& .MuiFilledInput-root': {
    backgroundColor: theme.palette.background.paper, // Màu nền của input
    borderRadius: theme.shape.borderRadius, // Bo tròn góc
  },
  '& .MuiFilledInput-underline::before': {
    borderBottom: 'none', // Loại bỏ viền dưới
  },
  '& .MuiFilledInput-underline::after': {
    borderBottom: 'none', // Loại bỏ viền dưới sau khi focus
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary, // Màu của icon
  },
}));




// const date = new Date();
// const hours = date.getHours();
// const minutes = date.getMinutes();
// const time = `${hours}:${minutes}`;

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <File size={24} />,
    y: 172,
    title: "Document",
  },
  {
    color: "#1b8cfe",
    icon: <VideoFile size={24} />,
    y: 242,
    title: "Video",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  handleKeyPressPieSocket,
  fileInputRef,
  handleFileChange,
  handleImageChange,
  handleVoiceMessage,
}) => {
  const [openActions, setOpenActions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const { current_conversation } = useSelector((state) => state.conversation.direct_chat);
 
  const recorderRef = useRef(null);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorderRef.current = new MediaRecorder(stream);
        recorderRef.current.start();
        setIsRecording(true);

        recorderRef.current.ondataavailable = async (e) => {
          const audioBlob = e.data;
          try {
            const id = `chat`
            const key = `audio_${Date.now()}.mp3` // Tên file âm thanh trên storage
            const audioKey = await uploadFileToFirebase(audioBlob, "audio", id, key) // Tải file âm thanh lên storage
            setAudioURL(audioKey); // Cập nhật URL âm thanh mới
            handleVoiceMessage(audioKey); // Gửi đường dẫn tệp âm thanh lên máy chủ
          } catch (error) {
            console.error("Failed to upload audio:", error);
          }
          stopRecording(); // Dừng ghi âm SAU khi tải lên xong
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    // Đã di chuyển stopRecording() vào trong hàm startRecording()
    try {
      const audioUrl = await uploadAudioToS3(audioBlob);
      if (handleVoiceMessage && typeof handleVoiceMessage === "function") {
        handleVoiceMessage(audioUrl);
      }
    } catch (error) {
      console.error("Error handling voice message:", error);
    }
  };

  const uploadAudioToS3 = async (audioBlob) => {
    const timeStamp = Date.now();
    const audioKey = `audio_${timeStamp}.mp3`; // Tên của file âm thanh trên S3
    const params = {
      Bucket: "chat-app-audio-cnm",
      Key: audioKey,
      Body: audioBlob,
    };
    await S3.upload(params).promise(); // Tải lên file âm thanh lên S3
    return `https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/${audioKey}`;
  };

  const handleCli = () => {
    console.log("click");
  }
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setValue(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to reset isTyping after a delay
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000); // 1 second delay (adjust as needed)
  
    // Kiểm tra xem giá trị nhập liệu có thay đổi hay không
    if (value.trim() !== "") {
      socket.emit("typing", { userId: current_conversation.user_id , conversationId: current_conversation.id});
    } else {
      socket.emit("stopTyping", { userId: current_conversation.user_id });
    }
  };
  

  useEffect(() => {
    // Lắng nghe sự kiện typing từ server
    socket.on("typing", ({ userId }) => {
      // Kiểm tra userId để biết ai đang soạn tin nhắn
      setIsTyping(true);

      // Thiết lập một timeout để ẩn thông báo typing sau một khoảng thời gian
      setTimeout(() => {
        setIsTyping(false);
      }, 2000); // Ví dụ: 2 giây sau khi ngừng nhập liệu
    });

    return () => {
      socket.off("typing"); // Dọn dẹp listener khi component unmount
    };
  }, []);


  return (
    <>
      <StyledInput
        inputRef={inputRef}
        value={value}
        // onChange={(event) => {
        //   setValue(event.target.value);
        // }}
        onChange={handleInputChange}
        fullWidth
        placeholder= {`Type a message to `}
        variant="filled"
        // onClick={handleCli}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <IconButton
              onClick={() => {
                setOpenActions(!openActions);
              }}
            >
              <LinkSimple />
            </IconButton>
          ),
          endAdornment: (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => {
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
              >
                {isRecording ? <Stop /> : <Mic />}
              </IconButton>
              {/* Additional end adornment content can go here */}
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </Stack>
          ),
        }}
        onKeyPress={handleKeyPressPieSocket}
        onFocus={handleCli}
      />
            {/* {isTyping && (
        <Typography variant="caption" color="textSecondary">
          {`${current_conversation.name} is typing...`}
        </Typography>
      )} */}

      <Stack
        sx={{
          position: "relative",
          display: openActions ? "inline-block" : "none",
          alignItems: "center", // Vertically centers the content
        }}
      >
        {Actions.map((el) => (
          <Tooltip placement="right" title={el.title} key={el.title}>
            <IconButton
              onClick={() => {
                if (el.title === "Photo/Video") {
                  fileInputRef.current.accept = "image/jpeg, image/png"; // Accept only images
                  fileInputRef.current.click();
                } else if (el.title === "Document") {
                  fileInputRef.current.accept =
                    "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // Accept only documents
                  fileInputRef.current.click();
                }
                setOpenActions(!openActions);
              }}
              sx={{
                position: "absolute",
                top: -el.y,
                backgroundColor: el.color,
              }}
              aria-label="add"
            >
              {el.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    </>
  );
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const theme = useTheme();
  const { current_conversation } = useSelector((state) => state.conversation.direct_chat);
  const user_id = window.localStorage.getItem("user_id");
  const [currentDateTime, setCurrentDateTime] = useState('');
  const user_name = window.localStorage.getItem("user_name");
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const { sideBar, room_id } = useSelector((state) => state.app);
  const [openPicker, setOpenPicker] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user_avatar } = useSelector((state) => state.auth);


  const autoSendMessageNotice = () => {
    const conversationData = {
      conversation_id: room_id,
      avatar: "",
      from: user_id,
      to: current_conversation.user_id,
      text: currentDateTime,
      type: "Timeline",
    };
    socket.emit('send_message', conversationData);
  };

  // useEffect(() => {  
  //   // Gửi thông báo ngay khi component mount
  //   autoSendMessageNotice();

  //   // Thiết lập interval để gửi thông báo mỗi 10 phút (600000ms)
  //   const interval = setInterval(() => {
  //     autoSendMessageNotice();
  //   }, 60000 );

  //   // Clear interval khi component unmount
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentDateTime(dateTime());
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval); // Xóa interval khi component unmount
}, []);










  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd)
      );

      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const key = generateFileName(file);
        const id = `chat ${room_id}`
        const imageUrl = await uploadFileToFirebase(file, "media", id, key);
        // console.log("image text", imageUrl);
        const conversationMedia = {
          conversation_id: room_id,
          avatar: user_avatar,
          from: user_id,
          to: current_conversation.user_id,
          time: currentDateTime,
          type: "Image",
          text: imageUrl,
        };

        socket.emit('send_message', conversationMedia);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const key = generateFileName(file);
        const id = `chat ${room_id}`
        const fileUrl = await uploadFileToFirebase(file, "file", id, key);
        const conversationDoc = {
          conversation_id: room_id,
          avatar: user_avatar,
          from: user_id,
          to: current_conversation.user_id,
          time: currentDateTime,
          type: "Document",
          text: fileUrl,
        };


        socket.emit('send_message', conversationDoc);
      } catch (error) {
        console.error('Failed to upload document:', error);
      }
    }
  };

  const generateFileName = (file) => {
    const timeStamp = Date.now();
    return `file_${timeStamp}_${file.name}`;
  };

  const uploadImageToS3 = async (file, key) => {
    const params = {
      Bucket: "chat-app-image-cnm",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/${key}`;
  };

  const uploadFileToS3 = async (file, key) => {
    const params = {
      Bucket: "chat-app-document-cnm",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://chat-app-document-cnm.s3.ap-southeast-1.amazonaws.com/${key}`;
  };

  function handleSocketMessage() {
    const messageContent = value.trim();
    if (messageContent) {
      const message = {
        message: linkify(value),
        type: containsUrl(value) ? "Link" : "Text",
      };
      const conversationData = {
        conversation_id: room_id,
        from: user_id,
        to: current_conversation.user_id,
      };
      socket.emit("send_message", message, conversationData);
      setValue("");
    }
  }



  function handlePieSocketMessage() {
    if (current_conversation && value.trim() !== "") {
      const messageContent = value.trim();
      let type;
      if (messageContent) {
        containsUrl(value) ? type = "Link" : type = "Text"
      }



      const conversationData = {
        conversation_id: room_id,
        avatar: user_avatar,
        from: user_id,
        to: current_conversation.user_id,
        text: messageContent,
        time: currentDateTime,
        type: type,
        avatar: user_avatar,
      };

      socket.emit('send_message', conversationData);
      setValue("");
    }
  }

  const handleKeyPressSocket = (e) => {
    const messageContent = value.trim();
    if (e.key === 'Enter') {
      socket.emit('new_message', messageContent);
      setValue("");
    }
  };



  const handleKeyPressPieSocket = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePieSocketMessage();
    }
  };

  const handleVoiceMessage = async (audioUrl) => {
    const conversationVoice = {
      conversation_id: room_id,
      avatar: user_avatar,
      from: user_id,
      to: current_conversation.user_id,
      text: audioUrl,
      time: currentDateTime,
      type: "Voice", // Sử dụng URL của file âm thanh thay vì tên tệp
    };

    socket.emit('send_message', conversationVoice);
  };


  return (
    
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
        
   

      }}
    >
   
    
      
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
          
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: isMobile ? 20 : sideBar.open ? 420 : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>
            {/* Chat Input */}
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              handleKeyPressPieSocket={handleKeyPressPieSocket}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              handleFileChange={handleFileChange}
              handleVoiceMessage={handleVoiceMessage}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton onClick={handlePieSocketMessage}>
                {/* <IconButton onClick={autoSendMessageNotice}> */}
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (fileInputRef.current.accept.includes("image")) {
              handleImageChange(e);
            } else {
              handleFileChange(e);
            }
          }}
          accept="" // Leave empty, will be set dynamically
        />
      </Box>
  
    </Box>
  );
};

export default Footer;
