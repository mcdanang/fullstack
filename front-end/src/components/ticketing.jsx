import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Portal,
  Text,
  HStack,
  Input,
  useNumberInput,
  Divider
} from '@chakra-ui/react';

export const Ticketing = (props) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 3,
      precision: 0,
    })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  function rupiah(price) {
    const priceString = price.toString();
    const len = priceString.length;
    let str = "";
    for (let i = 0; i < len; i++) {
      str += priceString[i];
      if ((len - i - 1) % 3 === 0 && i !== len - 1) {
        str += ".";
      }
    }
    return `Rp${str}`;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="blue">Buy Ticket</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Detail Pemesanan</PopoverHeader>
          <PopoverBody>
            <Text fontWeight={"bold"} fontSize={20}>{props.detail.name}</Text>
            <Text fontWeight={"bold"}>{props.detail.date}</Text>
            <Divider my={3}></Divider>
            <Text>Harga tiket: {rupiah(props.detail.price)}</Text>
            <Text>Jumlah tiket:</Text>
            <HStack maxW='320px' my={2}>
              <Button {...dec} colorScheme='red'>-</Button>
              <Input {...input} maxW={'50px'} textAlign={"center"}/>
              <Button {...inc} colorScheme='green'>+</Button>
              <Text fontSize={12}>Max 3 ticket</Text>
            </HStack>
            <Divider my={3}></Divider>
            <HStack maxW='320px' my={2}>
              <Text fontSize={20}>Total Harga: {rupiah(props.detail.price * input.value)}</Text>
              <Button colorScheme="green">Buy Now</Button>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}