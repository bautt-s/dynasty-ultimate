import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getPlayerAvatar } from "./waiver-card";
import { FaPlus } from "react-icons/fa6";

interface TradeProps {
    t: any

    trade: {
        id: string,
        date: string,
        season: number,
        type: string,
        rosters: number[]
        moves: any
    },

    p: any
}

const getPosition = (round: number) => {
    switch (round) {
        case 1:
            return 'st'
        case 2:
            return 'nd'
        default:
            return 'th'
    }
}

export const TradeCard = (props: TradeProps) => {
    const { t, trade, p } = props

    const firstRoster = t?.teamManagersMap[t.currentSeason][trade.rosters[0]]
    const secondRoster = t?.teamManagersMap[t.currentSeason][trade.rosters[1]]

    const moves = trade?.moves

    return (
        <div className="mb-12">
            <div className="flex flex-row mx-auto w-fit gap-x-[180px]">
                <div className="flex flex-col items-center gap-y-6 relative">
                    <img src={firstRoster.team.avatar} className="rounded-full w-12 relative top-4 border-gold border-2" />
                    <span className="absolute bottom-[-50px] w-[200px] text-center">
                        {firstRoster?.team?.name?.length < 22 ? firstRoster.team.name : firstRoster.team.name.slice(0, 20) + '...'}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-y-6 relative">
                    <img src={secondRoster.team.avatar} className="rounded-full w-12 relative top-4 border-gold border-2" />
                    <span className="absolute bottom-[-50px] w-[200px] text-center">
                        {secondRoster?.team?.name?.length < 22 ? secondRoster.team.name : secondRoster.team.name.slice(0, 20) + '...'}
                    </span>
                </div>
            </div>

            <div className="bg-neutral-950 mt-16 pt-8 pb-2 rounded-3xl">
                {moves.map((m: any, index: number) =>
                    <div key={index} className="flex flex-col w-full mb-12">
                        <div className="flex flex-row w-full trade-line relative">
                            <div className="flex flex-row w-1/2 justify-center">
                                {m[0] === 'origin'
                                    ?
                                    <div className="h-fit my-auto flex">
                                        <div className="rounded-full border-2 border-gray-600 border-dashed 
                                        text-4xl text-gray-600">
                                            <RiArrowRightSLine />
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        {'pick' in m[0]
                                            ?
                                            <div className="relative">
                                                <div className="rounded-full bg-gray-800 bg-opacity-55 py-3 text-gray-600
                                                border-2 border-lime-400">
                                                    <span className="text-center">Round</span>

                                                    <span className="absolute text-xl text-white top-1/2 left-1/2 
                                                    -translate-x-1/2 -translate-y-1/2">
                                                        <span className="font-semibold">{m[0]?.pick.round}</span>
                                                        <span className="text-xs">{getPosition(m[0]?.pick.round)}</span>
                                                    </span>

                                                    <div className="p-1 text-xs rounded-full absolute bottom-[-7px] 
                                                    right-[-7px] bg-teal-500 border-[3px] text-white">
                                                        <FaPlus />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center text-sm absolute left-1/2 -translate-x-1/2 w-[200px] mt-[8px]">
                                                    <span className="">{m[0]?.pick.season}</span>
                                                    
                                                    <span className="italic text-gray-400 mt-[-4px]">
                                                        {t?.teamManagersMap[t.currentSeason][m[0]?.pick.original_owner]?.team.name}
                                                    </span>
                                                </div>
                                            </div>
                                            :
                                            <div className="relative">
                                                <div className={`h-16 w-16 rounded-full bg-gray-700 relative`}
                                                    style={{ backgroundImage: getPlayerAvatar(p[m[0]?.player]?.pos, m[0]?.player), backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                                    <div className="p-1 text-xs rounded-full absolute bottom-[-7px] 
                                                    right-[-7px] bg-teal-500 border-[3px]">
                                                        <FaPlus />
                                                    </div>
                                                </div>

                                                <div className="flex flex-row gap-x-2 absolute w-[200px] left-1/2 -translate-x-1/2 justify-center mt-2 items-center">
                                                    <span className="text-sm">
                                                        {p[m[0].player] ? (p[m[0].player]?.fn + '  ' + p[m[0]?.player]?.ln) : 'Not found'}
                                                    </span>

                                                    <span className="text-xs text-gray-400 mt-[1px]">
                                                        {(p[m[0].player]?.pos || 'N/A') + ' - ' + (p[m[0]?.player]?.t || 'N/A')}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>

                            <div className="flex flex-row w-1/2 justify-center">
                                {m[1] === 'origin'
                                    ?
                                    <div className="h-fit my-auto flex">
                                        <div className="rounded-full border-2 border-gray-600 border-dashed text-4xl text-gray-600">
                                            <RiArrowLeftSLine />
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        {'pick' in m[1]
                                            ?
                                            <div className="relative">
                                                <div className="rounded-full bg-gray-800 bg-opacity-55 py-3 text-gray-600
                                                border-2 border-lime-400">
                                                    <span className="text-center">Round</span>

                                                    <span className="absolute text-xl text-white top-1/2 left-1/2 
                                                    -translate-x-1/2 -translate-y-1/2">
                                                        <span className="font-semibold">{m[1]?.pick.round}</span>
                                                        <span className="text-xs">{getPosition(m[1]?.pick.round)}</span>
                                                    </span>

                                                    <div className="p-1 text-xs rounded-full absolute bottom-[-7px] 
                                                    right-[-7px] bg-teal-500 border-[3px] text-white">
                                                        <FaPlus />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center text-sm absolute left-1/2 -translate-x-1/2 w-[200px] mt-[8px]">
                                                    <span className="">{m[1]?.pick.season}</span>
                                                    <span className="italic text-gray-400 mt-[-4px]">{t?.teamManagersMap[t.currentSeason][m[1].pick.original_owner]?.team.name}</span>
                                                </div>
                                            </div>
                                            :
                                            <div className="relative">
                                                <div className={`h-16 w-16 rounded-full bg-gray-700 relative`}
                                                    style={{ backgroundImage: getPlayerAvatar(p[m[1]?.player]?.pos, m[1]?.player), backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                                    <div className="p-1 text-xs rounded-full absolute bottom-[-7px] 
                                                    right-[-7px] bg-teal-500 border-[3px]">
                                                        <FaPlus />
                                                    </div>
                                                </div>

                                                <div className="flex flex-row gap-x-2 absolute w-[200px] left-1/2 -translate-x-1/2 justify-center mt-2 items-center">
                                                    <span className="text-sm">
                                                        {p[m[1].player] ? (p[m[1].player]?.fn + '  ' + p[m[1]?.player]?.ln) : 'Not found'}
                                                    </span>

                                                    <span className="text-xs text-gray-400 mt-[1px]">
                                                        {(p[m[1].player]?.pos || 'N/A') + ' - ' + (p[m[1]?.player]?.t || 'N/A')}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )}
                <span className="w-fit mx-auto flex italic text-xs text-gray-500 pt-2">{trade.date}</span>
            </div>
        </div>
    )
}