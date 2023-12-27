import { ConnectButton } from "web3uikit"
export default function Header() {
    return (
        <div className="p-2 border-b-2 flex flex-col md:flex-row items-center">
            <img
                src="/scalability.png"
                className="w-16 h-16 object-cover ml-3 mb-2 md:mb-0"
                alt="Scalability"
            ></img>
            <h1 className="py-2 px-4 font-blog text-3xl text-center md:text-left md:flex-1">
                Autonomous BET
            </h1>
            <div className="ml-auto py-2 px-4 justify-center">
                <ConnectButton moralisAuth={false}></ConnectButton>
            </div>
        </div>
    )
}
