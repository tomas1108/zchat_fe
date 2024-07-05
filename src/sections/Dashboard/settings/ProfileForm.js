import React, { useCallback, useState, useRef, useEffect } from "react";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../../components/hook-form/FormProvider";
import { RHFTextField, RHFUploadAvatar } from "../../../components/hook-form";
import { Button, Stack, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import S3 from "../../../utils/s3";
import { UpdateUserAvatar, UpdateUserProfile } from "../../../redux/slices/auth";
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCB3_DCrMJlPb6FE3MI60X98Dgpr__krNI",
  authDomain: "zchat-e58b1.firebaseapp.com",
  projectId: "zchat-e58b1",
  storageBucket: "zchat-e58b1.appspot.com",
  messagingSenderId: "299068763423",
  appId: "1:299068763423:web:958316cc2b4336dcac542a",
  measurementId: "G-FPPCJFSGH3"
};
// Khởi tạo Firebase app nếu chưa tồn tại
const firebaseApp = initializeApp(firebaseConfig);

// Lấy ra storage từ Firebase
const storage = getStorage(firebaseApp);



const ProfileForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const { user } = useSelector((state) => state.app);
  const { user_email } = useSelector((state) => state.auth);
  const { user_name } = useSelector((state) => state.auth);
  const {user_avatar} = useSelector((state) => state.auth);
  const { user_id } = useSelector((state) => state.auth);
  const {user_birthDate} = useSelector((state) => state.auth);
  const {user_gender} = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);



  const handleEditAvatar = () => {
    fileInputRef.current.click(); // Khi người dùng nhấn vào nút "Edit", kích hoạt sự kiện click trên thẻ input[type=file]
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleRemoveAvatar = () => {
    // Xử lý logic khi người dùng chọn xóa ảnh đại diện
    handleClose();
  };
  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    gender: Yup.string().required("Gender is required"),
    day: Yup.number().required("Day is required").min(1).max(31),
    month: Yup.number().required("Month is required").min(1).max(12),
    year: Yup.number().required("Year is required").min(1900).max(new Date().getFullYear()),
  });

  const generateFileName = (file) => {
    // Lấy ngày giờ hiện tại
    const timeStamp = Date.now();

    // Kết hợp tên người dùng, ngày giờ và tên file để tạo tên file mới
    return `image_${timeStamp}_${file.name}`;
  };
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();
  const genderValue = user_gender ? "Male" : "Female";
  const birthDate = new Date(user_birthDate);
  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      name: user_name,
      email: user_email,
      gender: genderValue,
      day: birthDate.getDate(),
      month:birthDate.getMonth() + 1,
      year: birthDate.getFullYear(),
     

 
  
    },
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, dirtyFields },
  } = methods;

  const watchedValues = watch();

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 25 * 10, // Tối đa hiển thị 10 mục
      },
    },
  };
 


  useEffect(() => {
    if (dirtyFields.name || dirtyFields.gender || dirtyFields.day || dirtyFields.month || dirtyFields.year) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [dirtyFields]);

  const onSubmit = async (data) => {
    try {
      console.log("DATA", data);
      dispatch(
        UpdateUserProfile(user_id, {
          firstName: data?.name,
          gender: data.gender,
          day: data.day,
          month: data.month,
          year: data.year
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDrop = useCallback(
  //   async (acceptedFiles) => {
  //     const file = acceptedFiles[0];
  //     setFile(file);
  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });
  //     if (file) {
  //       const key = generateFileName(file);
  //       try {
  //         const imageUrl = await uploadFileToS3(file, key);
  //         console.log("Image URL", imageUrl);
  //         // Cập nhật giá trị avatar trong form
  //         setValue("avatar", imageUrl, { shouldValidate: true });
  //         // Dispatch action để cập nhật avatar trong Redux và cơ sở dữ liệu
  //         // dispatch(
  //         //   UpdateUserAvatar(user_id, {
  //         //     avatar: imageUrl,
  //         //   })
  //         // );
  //       } catch (error) {
  //         console.error("Error uploading file to S3:", error);
  //         // Xử lý lỗi tải lên ở đây nếu cần thiết
  //       }
  //     }
  //   },
  //   [dispatch, setValue, user_id]
  // );
  
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        const key = generateFileName(file);
        try {
          const imageUrl = await uploadFileToFirebase(file, key);
          console.log("Image URL", imageUrl);
          // Cập nhật giá trị avatar trong form
          setValue("avatar", imageUrl, { shouldValidate: true });
          // Dispatch action để cập nhật avatar trong Redux và cơ sở dữ liệu
          dispatch(
            UpdateUserAvatar(user_id, {
              avatar: imageUrl,
            })
          );
        } catch (error) {
          console.error("Error uploading file to Firebase:", error);
          // Xử lý lỗi tải lên ở đây nếu cần thiết
        }
      }
    },
    [dispatch, setValue, user_id]
  );
  

  const uploadFileToS3 = async (file, key) => {
    const params = {
      Bucket: "codingmonk",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://codingmonk.s3.ap-south-1.amazonaws.com/${key}`;
   
  };

  const uploadFileToFirebase = async (file, key) => {
    const fileRef = ref(storage, `images/${user_id}/${key}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };
  

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
      <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />
        <RHFTextField
          helperText={"This name is visible to your contacts"}
          name="name"
          label="Name"
        />
        
        <FormLabel component="legend">Gender</FormLabel>
        <FormControl component="fieldset">

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormLabel component="legend">Birthday</FormLabel>
        <Stack direction="row" spacing={2}>
          <Controller
            name="day"
            control={control}
            render={({ field }) => (
              <FormControl>
                <Select {...field} displayEmpty MenuProps={menuProps}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, '0')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <FormControl>
                <Select {...field} displayEmpty MenuProps={menuProps}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, '0')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="year"
            control={control}
            
            render={({ field }) => (
              <FormControl>
                <Select {...field} displayEmpty MenuProps={menuProps}>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>


        <Stack direction={"row"} justifyContent="end">
          <LoadingButton
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            disabled={!isButtonEnabled}
          // loading={isSubmitSuccessful || isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
