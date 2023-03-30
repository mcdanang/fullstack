import { Button, Flex, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <VStack justify='space-evenly' align='flex-end' shadow="base" bgColor="gray.50" w="100vw" h="16">
      <Flex justify='space-evenly'>
        <Button
          onClick={() => navigate("/login")}
          rounded={"full"}
          bg={"blue.400"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
          mr='2'
        >
          Login
        </Button>
        <Button mr='2' rounded={"full"} onClick={() => navigate("/register")}>
          Register
        </Button>
      </Flex>
    </VStack>
  );
};
