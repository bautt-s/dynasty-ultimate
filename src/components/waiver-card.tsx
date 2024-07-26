interface WaiverProps {
    t: {
        team: {
            avatar: string,
            name: string
        },
        managers: string[]
    },

    w: {
        id: string,
        date: string,
        season: number,
        type: string,
        rosters: number[]
        moves: any
    },

    p: any
}

export const getPlayerAvatar = (pos: string, player: string) => {
    if (pos == 'DEF') {
        return `url(https://sleepercdn.com/images/team_logos/nfl/${player.toLowerCase()}.png)`;
    }

    return `url(https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`;
}

export const WaiverCard = (props: WaiverProps) => {
    // team, waiver, players
    const { t, w, p } = props

    const playerCode = w.moves[0][0].player
    const playerInfo = p[playerCode]
    
    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-x-3">
                <img src={t.team.avatar} className="rounded-full w-12 relative top-4 border-gold border-2" />
                <span className="mt-5">{t.team.name}</span>
            </div>

            <div className="bg-neutral-950 flex flex-col mx-4 px-4 pt-4  rounded-bl-[50px] rounded-r-[50px]">
                <div className="flex flex-row items-center gap-x-4">
                    <div className='h-16 w-16 rounded-full bg-gray-700 relative border-2'
                    style={{ backgroundImage: getPlayerAvatar(playerInfo?.pos, playerCode), 
                    backgroundPosition: 'center', backgroundSize: 'cover', borderColor: `var(--${playerInfo?.pos})`}}>
                        <span className={`px-2 py-0 text-xl rounded-full absolute bottom-[-5px] right-[-5px] 
                            ${w.moves[0][0].type === 'Added' ? 'bg-green-500' : 'bg-red-400'}`}>
                            {w.moves[0][0].type === 'Added' ? '+' : '-'}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span>{playerInfo?.fn + ' ' + playerInfo?.ln}</span>
                        <span className="text-xs text-gray-400">{playerInfo?.pos + ' - ' + (playerInfo?.t || 'N/A')}</span>
                    </div>
                </div>

                <span className="w-fit mx-auto flex italic text-xs text-gray-500 pb-2">{w.date}</span>
            </div>
        </div>
    )
}