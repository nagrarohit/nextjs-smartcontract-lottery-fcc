import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setrecentWinner] = useState("0")
    const [raffleState, setRaffleState] = useState("0")
    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        // params: {}
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRaffleState",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        const raffleStateFromCall = (await getRaffleState()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setrecentWinner(recentWinnerFromCall)
        setRaffleState(raffleStateFromCall)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handlesuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "transaction completed",
            title: "Tx notification",
            position: "topR",
            //icon:
        })
    }
    return (
        <div className="p-5">
            Welcome to the Decentralized Lottery
            {raffleAddress ? (
                <div>
                    <div className="">
                        <button
                            className="bg-blue-500 hover:bg-blue-700
                             text-white font-bold py-2 px-4  rounded ml-auto"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handlesuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                <div>Enter Raffle</div>
                            )}
                        </button>
                    </div>
                    Entrance Fee for the lottery is:
                    {ethers.utils.formatUnits(entranceFee, "ether")}
                    ETH
                    <p>No. of players:{numPlayers}</p>
                    <p>Recent Winner is:{recentWinner}</p>
                    <p>RaffleState is:{raffleState}</p>
                </div>
            ) : (
                <div>No Raffle address detected</div>
            )}
        </div>
    )
}
