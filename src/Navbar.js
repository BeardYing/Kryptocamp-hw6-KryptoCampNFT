import React from 'react'
import { Box, Flex, Image, Link, useToast, Spacer } from '@chakra-ui/react'
import Facebook from './assets/social-media-icons/facebook_32x32.png'
import Twitter from './assets/social-media-icons/twitter_32x32.png'
import Email from './assets/social-media-icons/email_32x32.png'
import { Button } from '@chakra-ui/react'
import { ethers } from 'ethers'

const Navbar = ({ accounts, setAccounts, setProvider}) => {
  const isConnected = Boolean(accounts[0]);
  const toast = useToast();
  
  
  // TODO: 連接錢包
  async function connectAccount() {

    const customerChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(customerChainId !== '0x5'){ 
      // 需要為測試鏈：Goerli才可連線錢包，進行提醒並跳出小狐狸切換！
      toast({
        title: `需要為測試鏈：Goerli，請切換至 Goerli 鏈後重新連結錢包。`,
        status: 'error',
        position: 'top',
        isClosable: true,
      })
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x5'}]}).then(()=>{
        _connect();
      });
    }else{
      // 已經為測試鏈，連線錢包
      _connect();
    }
  }
  
  async function _connect() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setAccounts(await signer.getAddress()); // 取得帳號並且設定帳號
  }

  

  return (
    <Flex
      className="navbar flex-row"
      justify="space-between" align="center"
      direction="row"
    >
      {/* Left Side - Social Media Icons */}

      <Flex justify="space-around" direction="row">
        <Link href="https://www.facebook.com" className="items">
          <Image src={Facebook} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.twitter.com" className="items">
          <Image src={Twitter} boxSize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.gamil.com" className="items">
          <Image src={Email} boxSize="42px" margin="0 15px" />
        </Link>
      </Flex>

      {/* Right Side - Section and Connect */}
      <Flex
        justify="space-around"
        align="center"
        className="flex-row"
        // width="40%"
        padding="30px"
      >
        <Box margin="0 15px" className="items">About</Box>
        <Spacer />
        <Box margin="0 15px" className="items">Mint</Box>
        <Spacer />
        <Box margin="0 15px" className="items">Team</Box>
        <Spacer />

        {/* Connect */}
        {isConnected ? (
          <Box margin="0 15px" fontSize="14px">{accounts.slice(0,5)}...{accounts.slice(-4)}</Box>
        ) : (
          <Button
            backgroundColor="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
            colorScheme='yellow'
          >
            Connect
          </Button>
        )}
      </Flex>

    </Flex>
  )
}

export default Navbar