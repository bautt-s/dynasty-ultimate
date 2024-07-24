'use client'

import { useEffect, useState } from "react"
import { WaiverCard } from "./waiver-card"
import { FaArrowRightLong } from "react-icons/fa6";
import { TradeCard } from "./trade-card";

const getRecentTrades = async () => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL)
    const ultimateId = (process.env.NEXT_PUBLIC_ULTIMATE_ID)
    const apexId = (process.env.NEXT_PUBLIC_APEX_ID)

    const [ultimateTradesRes, apexTradesRes, teamsUltimateRes, teamsApexRes] = await Promise.all([
        fetch(apiUrl + `/leagues/transactions/${ultimateId}`),
        fetch(apiUrl + `/leagues/transactions/${apexId}`),
        fetch(apiUrl + `/managers/${ultimateId}`),
        fetch(apiUrl + `/managers/${apexId}`),
    ])

    const [ultimateTrades, apexTrades, teamsUltimate, teamsApex] = await Promise.all([
        ultimateTradesRes.json(),
        apexTradesRes.json(),
        teamsUltimateRes.json(),
        teamsApexRes.json()
    ])

    return { ultimateTrades, apexTrades, teamsUltimate, teamsApex }
}

export const RecentTrades = () => {
    const [recentTrades, setRecentTrades] = useState<any>({})

    useEffect(() => {
        getRecentTrades().then(recentTrades => {
            setRecentTrades(recentTrades);
        });
    }, [])

    const recentWaiversUltimate = recentTrades.ultimateTrades?.transactions?.filter((t: any) => t.type === 'waiver').slice(0, 3)
    const recentWaiversApex = recentTrades.apexTrades?.transactions?.filter((t: any) => t.type === 'waiver').slice(0, 3)

    const recentTradesUltimate = recentTrades.ultimateTrades?.transactions?.filter((t: any) => t.type === 'trade').slice(0, 3)
    const recentTradesApex = recentTrades.apexTrades?.transactions?.filter((t: any) => t.type === 'trade').slice(0, 3)

    const teamsUltimate = recentTrades.teamsUltimate
    const teamsApex = recentTrades.teamsApex

    if (typeof global.window?.localStorage.getItem('players') === 'string') {
        var players = JSON.parse(global.window?.localStorage.getItem('players') || '{"players": "undefined"}')
    }

    return (
        <div className="text-white py-12 px-4">
            <div id='waivers'>
                <div id='ultimate-wavers'>
                    <h2 className="text-gray-50 text-xl text-center font-semibold">Recent Waiver Moves</h2>
                    <h4 className="text-gray-50 text-lg text-center">Ultimate Conference</h4>

                    <div className="mt-2">
                        {recentWaiversUltimate ?
                            recentWaiversUltimate.length ?
                                recentWaiversUltimate.map((rw: any, indexA: number) =>
                                    <WaiverCard
                                        t={teamsUltimate.teamManagersMap[teamsUltimate.currentSeason][rw.rosters[0]]}
                                        w={rw}
                                        p={players}
                                        key={indexA}
                                    />)
                                :
                                <span className="flex w-fit mx-auto text-gray-500">No waivers found.</span>
                            :
                            <p className="text-center text-yellow-800">Loading...</p>
                        }
                    </div>
                </div>

                <div id='apex-wavers' className="mt-12">
                    <h2 className="text-gray-50 text-xl text-center font-semibold">Recent Waiver Moves</h2>
                    <h4 className="text-gray-50 text-lg text-center">Apex Conference</h4>

                    <div className="mt-2">
                        {recentWaiversApex ?
                            recentWaiversApex.length ?
                                recentWaiversApex.map((rw: any, indexA: number) =>
                                    <WaiverCard
                                        t={teamsApex.teamManagersMap[teamsApex.currentSeason][rw.rosters[0]]}
                                        w={rw}
                                        p={players}
                                        key={indexA}
                                    />)
                                :
                                <span className="flex w-fit mx-auto text-gray-500">No waivers found.</span>
                            :
                            <p className="text-center text-yellow-800">Loading...</p>
                        }
                    </div>
                </div>

                <button className="flex underline items-center gap-x-2 group mx-auto mt-6 text-gold">
                    View more wavers
                </button>
            </div>

            <div id='trades' className="mt-20">
                <div id='ultimate-trades'>
                    <h2 className="text-gray-50 text-xl text-center font-semibold">Recent Trades</h2>
                    <h4 className="text-gray-50 text-lg text-center">Ultimate Conference</h4>

                    <div className="mt-2">
                        {recentTradesUltimate ?
                            recentTradesUltimate.length ?
                                recentTradesUltimate.map((rw: any, indexA: number) =>
                                    <TradeCard
                                        t={teamsUltimate}
                                        trade={rw}
                                        p={players}
                                        key={indexA}
                                    />)
                                :
                                <span className="flex w-fit mx-auto text-gray-500">No trades found.</span>
                            :
                            <p className="text-center text-yellow-800">Loading...</p>
                        }
                    </div>
                </div>

                <div id='apex-trades' className="mt-12">
                    <h2 className="text-gray-50 text-xl text-center font-semibold">Recent Trades</h2>
                    <h4 className="text-gray-50 text-lg text-center">Apex Conference</h4>

                    <div className="mt-2">
                        {recentTradesApex ?
                            recentTradesApex.length ?
                                recentTradesApex.map((rw: any, indexA: number) =>
                                    <TradeCard
                                        t={teamsApex}
                                        trade={rw}
                                        p={players}
                                        key={indexA}
                                    />)
                                :
                                <span className="flex w-fit mx-auto text-gray-500">No trades found.</span>
                            :
                            <p className="text-center text-yellow-800">Loading...</p>
                        }
                    </div>

                    <button className="flex underline items-center gap-x-2 group mx-auto mt-6 text-gold">
                        View more trades
                    </button>
                </div>
            </div>
        </div>
    )
}