import { Button, Input, Text, Image, Avatar, Box } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { User } from "./services/user-services";
import useCustomer from "./hooks/useCustomer";
import useUsers, { UserDetails } from "./hooks/useUsers";
import useUsersDetails from "./hooks/useUsersDetails";
import apiClient from "./services/api-client";

interface CustomerProfileStatus{
  profileStatus:()=>void;
}

function CustomerProfile({profileStatus}:CustomerProfileStatus) {
  const [CustomerDetails, SetCustomerDetails] = useState<User>();
  const { customer, SetCustomer } = useCustomer();
  const [edit, SetEdit] = useState(false);
  const [editimage, SetEditimage] = useState(false);

  const [user, SetUser] = useState<UserDetails>({} as UserDetails);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  console.log(selectedFile);
  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      apiClient
        .patch("/store/customer/me/", formData)
        .then((response) => {
          SetCustomer({ ...customer, image: response.data.image });
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
        });
    } else {
      console.warn("No file selected for upload.");
    }
    SetEditimage(false);
    profileStatus();
  };

  console.log(user);
  console.log(customer.image);

  useEffect(() => {
    apiClient.get("/auth/users/me/").then((res) => SetUser(res.data));
  }, []);

  function UpdateCustomer() {
    apiClient.put("/auth/users/me/", user).then((res) => SetUser(res.data));
    apiClient
      .put("/store/customer/me/", customer)
      .then((res) => SetCustomer(res.data));
    SetEdit(false)
    profileStatus();
  }

  return (
    <>
      <Text marginLeft={'300px'} fontSize={'4xl'} fontWeight={'bold'}>{user.first_name} {user.last_name}</Text>
      <Avatar size='2xl' boxSize={'300px'}  name={user.first_name+' '+user.last_name} src={"http://127.0.0.1:8000" + customer.image}/>
     
      {editimage || (
        <Button colorScheme="yellow" marginTop={'200px'} marginLeft={3} onClick={() => SetEditimage(true)}>Change Avatar</Button>
      )}
      {editimage && (
        <Box marginTop={'200px'} marginLeft={3} display={"inline-block"}>
          <Input bgColor={'none'} border={"none"} color="yellow" type="file" onChange={handleFileChange} />
          <Button marginTop={3} colorScheme="yellow" onClick={handleUpload}>Upload Photo</Button>
        </Box>
      )}

      <Text marginTop={10} fontSize={'2xl'}>First Name</Text>
      <Input
        value={user?.first_name}
        color={'yellow'}
        disabled={!edit}
        onChange={(e) => SetUser({ ...user, first_name: e.target.value })}
        type="text"
      />

      <Text marginTop={5} fontSize={'2xl'} >Last Name</Text>
      <Input
        value={user?.last_name}
        color={'yellow'}
        disabled={!edit}
        onChange={(e) => SetUser({ ...user, last_name: e.target.value })}
        type="text"
      />

    <Text marginTop={5} fontSize={'2xl'} >Email</Text>
      <Input
        value={user?.email}
        color={'yellow'}
        disabled
        type="text"
      />

      <Text marginTop={5} fontSize={'2xl'} >Address</Text>
      <Input
        value={customer?.address}
        color={'yellow'}
        disabled={!edit}
        onChange={(e) => SetCustomer({ ...customer, address: e.target.value })}
        type="text"
      />

      <Text marginTop={5} fontSize={'2xl'} >Phone</Text>
      <Input
        value={customer?.phone}
        color={'yellow'}
        disabled={!edit}
        onChange={(e) =>
          SetCustomer({ ...customer, phone: parseInt(e.target.value) })
        }
        type="text"
      />

      {edit || <Button marginTop={7} size={'md'} onClick={() => SetEdit(true)}>Edit</Button>}
      {edit && <Button marginTop={7} size={'md'} onClick={() => SetEdit(false)}>Cancel</Button>}
      {edit && <Button marginLeft={5} marginTop={7} colorScheme="yellow" size={'lg'} onClick={UpdateCustomer}>Update</Button>}
    </>
  );
}

export default CustomerProfile;
