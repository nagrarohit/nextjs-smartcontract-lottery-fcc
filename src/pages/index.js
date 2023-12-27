import Head from "next/head"
import styles from "../styles/Home.module.css"
//import ManualHeader from "components/ManualHeader.jsx"
import Header from "components/Header"
import Footer from "components/Footer"
import LotteryEntrance from "components/LotteryEntrance"
export default function () {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart contract lottery</title>
                <meta name="description" content="Our Smart Contract Lottery"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="icon" href="/scalability.png"></link>
            </Head>
            {/* {<ManualHeader></ManualHeader>} */}
            <Header></Header>
            <LotteryEntrance></LotteryEntrance>
            <Footer></Footer>
        </div>
    )
}
