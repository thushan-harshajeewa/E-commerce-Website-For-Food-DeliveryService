import { Button, Container, FormLabel, Input, InputGroup, InputRightElement ,Text} from "@chakra-ui/react";

import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ManageUsers, { User } from "./services/user-services";
import useUsersErrors from "./hooks/useUsersErrors";
import apiClient from "./services/api-client";
import { useState } from "react";

export interface ChangeLoginButton {
  ChangeLoginButton: (status: boolean) => void;
  
}

function Login({ ChangeLoginButton, }: ChangeLoginButton) {
  const { error, setError, django, SetDjango } = useUsersErrors();
  const { handleSubmit, register } = useForm<User>();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  function handle(data: FieldValues) {
    ManageUsers.CreateUserToken(data)
      .then((res) => {
        ManageUsers.setTokenToLocalStorage(res.data);
        ManageUsers.setloginButtonToLocalStorage(true);
      })
      .then(() => {
        
        ChangeLoginButton(true);
        navigate("/home-menu");
        
      })
      .catch((err) => {
        setError(err.message);
        SetDjango({
          ...django,
          password: err.response.data.password,
          detail: err.response.data.detail,
          email: err.response.data.email,
        });
      });
  }
  return (
    <>
      <Container>
        <form onSubmit={handleSubmit(handle)}>
          <FormLabel marginTop={"20px"}>Email</FormLabel>
          <Input {...register("email")}  id="password" type="text" />
          {django?.email &&
            django.email.map((item, index) => (
              <h3 className="text-danger" key={index}>
                {item}
              </h3>
            ))}

          <FormLabel marginTop={"20px"}>Password</FormLabel>
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
            django.password.map((item, index) => (
              <h3 key={index} className="text-danger">
                {item}
              </h3>
            ))}

          {django?.detail && <h3 className="text-danger">{django.detail}</h3>}
          {error && <h3 className="text-danger">{error}</h3>}
          <Button colorScheme="blue" type="submit" mt={"15px"}>
            Login
          </Button>
        </form>
        <Text marginTop={5} cursor={"pointer"} onClick={()=>navigate('/sign')}>Dont Have An Account? SignUp.</Text>
      </Container>
    </>
  );
}

export default Login;
