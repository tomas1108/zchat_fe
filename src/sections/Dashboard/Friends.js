import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  FetchAllUsers,
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
} from "../../redux/slices/app";
import {
  FriendElement,
  FriendRequestElement,
  UserElement,
} from "../../components/UserElement";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTexField";
import { SimpleBarStyle } from "../../components/Scrollbar";
import ScrollbarCustom from "../../components/ScrollbarCustom";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ScrollbarNormal from "../../components/ScrollbarNormal";
import axios from "../../utils/axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const user_id = localStorage.getItem("user_id");

const ResulSearchList = ({ search }) => {
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const { users } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(FetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetching(true);
      try {
        if (search !== "") {
          const token = localStorage.getItem("token");
          const response = await axios.get(`/user/get-user/${search.toLowerCase()}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }
          );

          setSearchResults(response.data.data); // Assuming API returns data field containing array of users

        } else {
          setSearchResults(null); // Clear search results if search is empty
        }
      } catch (error) {
        throw error;

      } finally {
        setIsFetching(false);
      }
    };

    fetchUsers();
  }, [search]);
  

  return (
    <>
      <Stack
        spacing={2}
        direction="column"
        sx={{ flexGrow: 1, height: "100%", overflowY: "auto" }}
      >
        <Stack spacing={2.4}>
        {/* <Typography variant="subtitle2" sx={{ color: "#676767" }}>
            Recent search
          </Typography> */}
          <ScrollbarNormal>
          
            {/* {searchResults.map((el, idx) => {
              return <UserElement key={idx} {...el} />;
            })} */}{/* Hiển thị UserElement nếu có kết quả */}
           {search !== "" && (
              <>
                {isFetching ? (
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress size={24} />
                  </Box>
                ) : searchResults && searchResults.length > 0  ? (
                  searchResults
                    .map((user, idx) => (
                 
                    <UserElement key={idx} {...user} />
                  ))
                ) : (
                  <p style={{ opacity: 0.5, textAlign: "center" }}>
                    NO USER FOUND
                  </p>
                )}
              </>
            )}
          </ScrollbarNormal>
      
        </Stack>
        <Stack spacing={2.4}>
        <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              Recommended
            </Typography>
          
          
          <ScrollbarNormal  >
            {users.map((el, idx) => (
              <UserElement key={idx} {...el} />
            ))}
          </ScrollbarNormal>
       
          
        </Stack>
      </Stack>
    </>
  );

};

const defaultValues = {
  email: "",
};



const SearchForm = () => {
  const methods = useForm({
    // defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const [search, setSearch] = useState("");

  const onSubmit = async (data) => {
    try {
      /// hàm API toạ group
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <RHFTextField
          name="email"
          label="Enter email or name"
          onKeyDown={handleEnterKeyPress}
          onChange={(e) => setSearch(e.target.value)}
          
        />
        <ResulSearchList search={search} />
      </Stack>
    </FormProvider>
  );
};

const UsersList = () => {
  return (
    <>
      <div> </div>
      <SearchForm></SearchForm>
    </>
  );
};

const FriendsList = () => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.app);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    dispatch(FetchFriends(user_id));
  }, [dispatch, user_id]);

  return (
    <>
    <Stack sx={{ maxHeight: '100%', overflowY: 'auto' }} >
      <ScrollbarNormal autoHeightMin="45vh">
        {friends.length > 0 ? (
          friends.map((el, idx) => <FriendElement key={idx} {...el} />)
        ) : (
          <p style={{ opacity: 0.5, textAlign: "center" }}>NO FRIEND FOUND</p>
        )}
      </ScrollbarNormal>
      </Stack>
    </>
  );
};

const RequestsList = () => {
  const dispatch = useDispatch();
  const { friendRequests } = useSelector((state) => state.app);
  console.log(friendRequests.length );

  // useEffect(() => {
  //   dispatch(FetchFriendRequests());
  // }, []);

  return (
    <>
    {friendRequests.length === 0 ? (
      <p style={{ opacity: 0.5, textAlign: "center" }}>NO REQUESTS</p>
    ) : (
      friendRequests.map((el, idx) => (
        <FriendRequestElement key={idx} {...el.sender} id={el._id} />
      ))
    )}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, []);

  const { friendRequests } = useSelector((state) => state.app);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      maxHeight="100%"
    >
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={2} >
        <Tabs sx={{ width: "100%", maxWidth: "800px", marginRight: "10 auto", }} value={value} onChange={handleChange} centered >
          <Tab label="Search" />
          <Tab label="Friends" />
          <Tab label="Requests" />
          <Badge badgeContent={friendRequests.length} color="error" sx={{ top:"25px", right:"-12px"}}>
                
              </Badge>
        
        </Tabs>
      </Stack>

      <Box sx={{ height: 400, overflowY: "auto" }}> 
      <DialogContent>
     
          <Stack spacing={2}>
            {(() => {
              switch (value) {
                case 0: // display all users in this list
                  return <UsersList />;
                case 1: // display friends in this list
                  return <FriendsList />;
                case 2: // display request in this list
                  return <RequestsList />;
                default:
                  break;
              }
            })()}
          </Stack>
        
       
      </DialogContent>
      </Box>

      <Box sx={{
        display: 'flex', 
        justifyContent: 'flex-end', 
        p: 2, 
        position: 'sticky', // This keeps the button at the bottom
        bottom: 0, // Even if the content scrolls, the button remains at the bottom
        width: '100%'  // Ensure the button spans the full dialog width
      }}>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Dialog>
  );
};

export default Friends;
