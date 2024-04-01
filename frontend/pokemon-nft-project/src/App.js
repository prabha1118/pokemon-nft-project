import { NFTCard, NftPhoto } from "./components/NFTCard";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import { NFTModal } from "./components/NFTModal";
import ethers from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { Contract } from "ethers";
import abi from './abi.json';
import { connect } from "./helperConfig";
import axios from 'axios';

function App() {

  let intialNfts =
    [
      { name: "Pokemon1", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon2", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon3", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon4", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon5", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon6", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon7", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon8", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon9", symbol: "POKMN", image: "https://via.placeholder.com/150" },
      { name: "Pokemon10", symbol: "POKMN", image: "https://via.placeholder.com/150" }
    ]

  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState();
  const [nfts, setNfts] = useState(intialNfts);

  useEffect(() => {

    (async () => {
      const address = await connect();
      if (address) {
        getNfts(address);
      }
    })()

  }, [])

  function toggleModal(i) {
    if (i >= 0) {
      setSelectedNft(nfts[i])
    }
    setShowModal(!showModal)
  }

  async function getMetadataFromIpfs(tokenURI) {
    let metadata = await axios.get(tokenURI);
    return metadata.data;
  }

  async function getNfts(address) {
    const rpc = "https://eth-sepolia.g.alchemy.com/v2/cj5irpeTFh0WNOdT5xj-R6SMY7U4QWD3"
    const provider = new JsonRpcProvider(rpc);

    let nftCollection = new Contract(
      "0x7Ce9cB2137634d0527B15A9ca889D81448504536",
      abi,
      provider
    )

    let collectionSymbol = await nftCollection.symbol();
    let tempArray = []
    let baseUrl = ""

    for (let i = 1; i <= 10; i++) {
      if (i == 1) {
        let tokenURI = await nftCollection.tokenURI(i);
        baseUrl = tokenURI.replace(/\d+.json/, "");
        let metadata = await getMetadataFromIpfs(tokenURI);
        metadata.symbol = collectionSymbol;
        tempArray.push(metadata);
        console.log(baseUrl);
        console.log(tempArray);
      } else {
        let metadata = await getMetadataFromIpfs(baseUrl + `${i}.json`);
        metadata.symbol = collectionSymbol;
        tempArray.push(metadata);
      }
    }

    setNfts(tempArray);
  }

  return (
    <div className="App">
      <Container>
        <Title> Pokemon Collection </Title>
        <Subtitle> From Pokemon world</Subtitle>
        <Grid>
          {
            nfts.map((nft, i) => {
              return <NFTCard nft={nft} key={i} toggleModal={() => toggleModal(i)} />
            })
          }
        </Grid>
      </Container>
      {
        showModal &&
        <NFTModal
          nft={selectedNft}
          toggleModal={() => toggleModal()}
        />
      }

    </div>
  );
}


const Title = styled.h1`
  margin: 0;
  text-align: center;
`

const Subtitle = styled.h4`
  color: gray;
  margin-top: 0;
  text-align: center;
`

const Container = styled.div`
  background-color: ;
  width: 70%;
  max-width: 1200px;
  margin: auto;
  margin-top: 100px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;

  @media(max-width: 1200px) {
    grid-template-column: 1fr 1fr 1fr;
  }

  @media(max-width: 900px) {
    grid-template-column: 1fr 1fr;
  }

  @media(max-width: 600px) {
    grid-template-column: 1fr 1fr;
  }
`

export default App;
