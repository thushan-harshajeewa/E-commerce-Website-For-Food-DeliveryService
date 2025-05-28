import {
  FormLabel,
  Input,
  Container,
  Text,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ManageUsers, { User } from "./services/user-services";
import useUsersErrors from "./hooks/useUsersErrors";

function Signin() {
  const { show, setShow, error, setError, django, SetDjango } = useUsersErrors();

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<User>();

  const handleClick = () => setShow(!show);

  function handle(data: FieldValues) {
    ManageUsers.userSign(data)
      .then(() => {
        ManageUsers.CreateUserToken(data).then((response) => {
          ManageUsers.AddAccessToken(response.data.access);
          ManageUsers.UpdateCustomer(data).then(() => console.log("ok"));
        });

        navigate("/login");
      })
      .catch((err) => {
        setError(err.message);
        SetDjango({
          ...django,
          password: err.response.data.password,
          email: err.response.data.email,
          detail: err.response.data.detail,
        });
      });
  }

  return (
    <>
      <Container padding={"50px"}>
        <Text fontSize={"4xl"} fontWeight={'bold'} marginTop={"30px"}>
          Sign Up Form
        </Text>

        <form onSubmit={handleSubmit(handle)}>
          <FormLabel  marginTop={"50px"}>First Name</FormLabel>
          <Input {...register("first_name")} id="first_name" type="text" />

          <FormLabel marginTop={"20px"}>Last Name</FormLabel>
          <Input {...register("last_name")} id="last_name" type="text" />

          <FormLabel marginTop={"20px"}>Email address</FormLabel>
          <Input {...register("email")} id="email" type="email" />
          {django?.email &&
            django?.email.map((item) => (
              <h3 key={item} className="text-danger">
                {item}
              </h3>
            ))}

          <FormLabel mt={"20px"}>Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              id="password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {django?.password &&
            django?.password.map((item) => (
              <h3 key={item} className="text-danger">
                {item}
              </h3>
            ))}

          <FormLabel   marginTop={"20px"}>Address</FormLabel>
          <Input  {...register('address')} id="address" type="text" />

          <FormLabel  marginTop={"20px"}>Phone</FormLabel>
          <Input  {...register("phone")} id="phone" type="text" />

          <Text fontSize={"1xl"} mt={"20px"}>
            Make sure To Type True Details
          </Text>

          
          <Button colorScheme="blue" type="submit" mt={"15px"}>
            Sign Up
          </Button>
        </form>
      </Container>
    </>
  );
}

export default Signin;
