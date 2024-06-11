import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends } from "../../../redux/slices/app";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import RHFAutocomplete from "../../../components/hook-form/RHFAutocomplete";

import { MemberElement } from "../../../components/UserElement";
import ScrollbarCustom from "../../../components/ScrollbarCustom";
import FormProvider from "../../../components/hook-form/FormProvider";

import { socket } from "../../../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteGroupForm = ({ handleClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.app);
  const { members } = useSelector(
    (state) => state.group.group_current_conversation
  );
  const { group_current_conversation } = useSelector((state) => state.group);
  const [filteredOptions, setFilteredOptions] = useState([]); // Danh sách phần tử được lọc

  const isMember = (friend) => {
    return members.some((member) => member.memberID === friend._id);
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearch(inputValue); // Cập nhật state search với nội dung nhập vào

    // Lọc danh sách phần tử phù hợp dựa trên nội dung nhập vào
    const filtered = friends.filter(
      (friend) =>
        friend.email.toLowerCase().includes(inputValue.toLowerCase()) &&
        !isMember(friend)
    );
    setFilteredOptions(filtered); // Cập nhật danh sách phần tử được lọc
  };

  useEffect(() => {
    const user_id = window.localStorage.getItem("user_id");
    dispatch(FetchFriends(user_id));
  }, [dispatch]);

  const NewGroupSchema = Yup.object().shape({
    members: Yup.array()
      .of(
        Yup.object().shape({
          _id: Yup.string().required(), // Đảm bảo mỗi thành viên có _id
          name: Yup.string().required(), // Đảm bảo mỗi thành viên có tên
        })
      )
      .min(1, "You must add at least one member"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    const memberList = selectedMembers.map((member) => ({
      name: member.name,
      avatar: member.avatar,
      memberID: member._id,
      role: "member",
    }));

    console.log(
      "Danh sách tv trong nhóm: ",
      group_current_conversation.members
    );
    console.log("Danh sách tv cần thêm: ", memberList);
    let connections = {};
    // let connectionsCount = 0; // Biến đếm số lượng kết nối WebSocket đã hoàn tất
    // let mergeList = [...group_current_conversation.members,...memberList];

    socket.emit(
      "update-group-members",
      memberList,
      group_current_conversation._id,
      (data) => {
        if (data.success) {
          memberList.forEach((member) => {
            // Kiểm tra xem kết nối đã tồn tại cho thành viên này chưa
         
          });
          group_current_conversation.members.forEach((member) => {
            // Kiểm tra xem kết nối đã tồn tại cho thành viên này chưa
          
          });
        } else {
          console.error("Error updating group members.");
        }
      }
    );

    handleClose();
  };

  const handleMemberSelect = (friend) => {
    if (!selectedMembers.some((member) => member._id === friend._id)) {
      setSelectedMembers((prev) => [...prev, friend]);
      methods.setValue("members", [...selectedMembers, friend]);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={[]}
          getOptionLabel={(option) => option.name}
          value={selectedMembers}
          onChange={(event, newValue) => {
            setSelectedMembers(newValue);
            methods.setValue("members", newValue); // Cập nhật giá trị trong form
          }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          ChipProps={{ size: "medium" }}
          inputValue={search} // Sử dụng state search làm giá trị nhập vào
          onInputChange={handleSearchChange} // Lắng nghe sự kiện thay đổi nội dung nhập
        />

        <ScrollbarCustom>
          {filteredOptions.map((friend) => (
            <MemberElement
              key={friend._id}
              name={friend.name}
              email={friend.email}
              img={friend.avatar}
              _id={friend._id}
              onClick={() => handleMemberSelect(friend)}
            />
          ))}
        </ScrollbarCustom>
        <Stack
          spacing={2}
          direction="row"
          alignItems={"center"}
          justifyContent="end"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const GroupDelete = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <DeleteGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default GroupDelete;
