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
            // Check if connected to Sepolia ETH testnet
            if (chainId !== 11155111) {
                dispatch({
                    type: "warning",
                    message: "Please switch to Sepolia ETH testnet to continue.",
                    title: "Network Alert",
                    position: "topR",
                })
            } else {
                updateUI()
            }
        }
    }, [isWeb3Enabled, chainId])

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
        <div className="p-5 min-h-screen text-center mt-16 text-lg md:text-4xl">
            <h1 className="text-4xl font-bold mb-6">Welcome to the Decentralized BET</h1>
            <h2 className="text-2xl font-bold mb-6">Please Use Eth Sepolia TestNet</h2>
            {raffleAddress ? (
                <div className="mt-4">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900
                text-white font-bold py-2 px-6 rounded inline-flex items-center"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handlesuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-5 w-5 border-b-2 rounded-full mr-2"></div>
                        ) : (
                            <div>Enter BET</div>
                        )}
                    </button>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg transition duration-300 hover:bg-blue-700">
                            <p className="text-sm md:text-base">
                                Entrance Fee for the lottery is:{" "}
                                {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                            </p>
                        </div>
                        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg transition duration-300 hover:bg-blue-700">
                            <p className="text-sm md:text-base">
                                Current No. of players: {numPlayers}
                            </p>
                        </div>
                        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg transition duration-300 hover:bg-blue-700">
                            <p className="text-sm md:text-base">Recent Winner: {recentWinner}</p>
                        </div>
                        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg transition duration-300 hover:bg-blue-700">
                            <p className="text-sm md:text-base">Raffle State: {raffleState}</p>
                        </div>
                        <a
                            className="mt-8 md:mb-8"
                            href="https://automation.chain.link/sepolia/84104590019129755347421267731198928559559093319109999067690374620939822825507"
                        >
                            {" "}
                            <img
                                src="https://chain.link/badge-automation-white"
                                alt="automation secured with chainlink"
                            />
                        </a>
                        <a className="mt-8 md:mb-8" href="https://vrf.chain.link/sepolia/8063">
                            {" "}
                            <img
                                src="https://chain.link/badge-randomness-white"
                                alt="randomness secured with chainlink"
                            />
                        </a>
                    </div>
                </div>
            ) : (
                <div>No Raffle address detected</div>
            )}
        </div>
    )
}
