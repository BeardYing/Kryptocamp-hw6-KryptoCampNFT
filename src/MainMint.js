import React from 'react'
import { Flex, Box, Text, Button, Input, useToast, Spacer } from '@chakra-ui/react'
import { useState } from 'react'
import { ethers } from 'ethers'
import kryptoCampNFTAbi from './KryptoCampNft.json'
import { useEffect } from 'react'

const KryptoCampNFTAddress = "0x5A5E65f915b8bCC6d856FEF6ed81f895062882d1";
const nftContractAbi = [
  // Some details about the token
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256 balance)",
  "function mint(uint256 _quantity) public payable"
];

const MainMint = ({ accounts, provider, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1)
  const [totalSupply, setTotalSupply] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [currentMinted, setCurrentMinted] = useState(0)
  const isConnected = Boolean(accounts[0])
  const toast = useToast()
  const mintPrice = '0.01'; // ethers string
  const toastIdRef = React.useRef(); // 處理中的 toast Id


  // TODO: 呼叫合約 totalSupply 方法，並寫入到變數 totalSupply
  const getNFTTotalSupply = async () => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // The Contract object - provider level
    const nftContract = new ethers.Contract(KryptoCampNFTAddress, nftContractAbi, provider);
    
    setTotalSupply((await nftContract.totalSupply()).toString());
    setMaxSupply((await nftContract.maxSupply()).toString());

    
    if(isConnected){
      // 連線後，開始判斷是否已經 mint 超過三張 -- 這邊雖然合約有問題沒有正常加到 walletMints , 還是在介面實作一下XD
      // 改使用 balance 來確認
      setCurrentMinted((await nftContract.balanceOf(accounts)).toString());
    }

  }

  // TODO: 呼叫 Contract mint fn
  const handleMint = async () => {
    if(currentMinted >= 3){
      // 已經超過最大mint數量
      showToast("單一地址最多只能 mint 3 張 NFT")
      return ;
    }
    if(parseInt(currentMinted) + parseInt(mintAmount)  > 3){
      // 已經超過最大mint數量
      showToast(`您目前最多只能 mint ${3 - currentMinted} 張 NFT`)
      return ;
    }

    if (window.ethereum) {
      // TODO: 1) 設定 Provider -- 已經從連結錢包時，綁定在 useState 上
      // TODO: 2) 設定 signer
      const signer = provider.getSigner();

      // TODO: 3) new Contract 實體 - signer level
      const nftContract = new ethers.Contract(KryptoCampNFTAddress, nftContractAbi, signer);

      try {
        // TODO: 4) 呼叫合約 mint 方法
        const tx_result = await nftContract.mint(mintAmount, {value : ethers.utils.parseEther('0.01').mul(mintAmount)});
        toastIdRef.current = toast({
          title: `交易處理中，請稍候`,
          status: 'info',
          position: 'top',
          duration: 30000, // 鎖定30秒
          isClosable: true,
        });

        await tx_result.wait();
        toast.close(toastIdRef.current) // 處理完成後，移除處理中訊息！
        getNFTTotalSupply() // 重整數量
        toast({
            title: `您已經成功 mint 到 NFT`,
            status: 'success',
            position: 'top',
            isClosable: true,
        });
        
      } catch ({ error }) {
        showToast(error.message)
        console.error('[Error]', error)
      }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return

    setMintAmount(mintAmount - 1)
  }

  const handleIncrement = () => {
    // if (mintAmount >= 3) return -- 根據原題意修改最多只能mint 3張
    if (parseInt(currentMinted) + parseInt(mintAmount) >= 3) return
    console.log(mintAmount+1)
    setMintAmount(mintAmount + 1)
  }

  // 顯示錯誤訊息
  const showToast = (error) => {
    toast({
      title: `發生錯誤：${error}`,
      status: 'error',
      position: 'top',
      isClosable: true,
    })
  }

  useEffect(() => {
    getNFTTotalSupply()
  }, [isConnected])

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
      <Box width="520px">
        <div className="mint-container">
          <Text fontSize="48px" textShadow="0 5px #000">KryptoCamp</Text>
          <Text
            fontSize="30px"
            letterSpacing="0.5%"
            fontFamily="VT323"
            textShadow="0 2px 2px #000"
            lineHeight={"26px"}
          >
            It's 2043.
            Can the KryptoCamp save humans from destructive rampant NFT speculation? Mint KryptoCamp to find out!
          </Text>
          <Spacer />


        </div>

        {isConnected ? (
          <div>
            <Flex align="center" justify="center">
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0f0f0f"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleDecrement}
              >
                -
              </Button>
              <Input
                readOnly
                fontFamily="inherit"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0f0f0f"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleIncrement}
              >
                +
              </Button>
            </Flex>
            <Button
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0f0f0f"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
              onClick={handleMint}
            >
              Mint Now
            </Button>

            {/* 目前已賣出 */}
            <Text
              fontSize="30px"
              letterSpacing="0.5%"
              fontFamily="VT323"
              textShadow="0 2px 2px #000"
              lineHeight={"26px"}
              marginTop="20px"
            >
              NFT TotalSupply {totalSupply} / {maxSupply}<br/>
              You Minted: {currentMinted}
            </Text>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 3px #000"
            color="#D6517D"
          >
            You must be connected to Mint
          </Text>
        )}
      </Box>
    </Flex>
  )
}

export default MainMint