'use client'

import { useEffect, useState } from "react"

interface options {
    ultimate: boolean,
    week: number,
    details: number | null
}

const apiUrl = (process.env.NEXT_PUBLIC_API_URL)

const getMatchups = async () => {
    const matchupsRes = await fetch(apiUrl + '/leagues/matchups')
    const matchupsData = await matchupsRes.json()

    return matchupsData
}

const getTeams = async () => {
    const ultimateId = (process.env.NEXT_PUBLIC_ULTIMATE_ID)
    const apexId = (process.env.NEXT_PUBLIC_APEX_ID)

    const [teamsUltimateRes, teamsApexRes] = await Promise.all([
        fetch(apiUrl + `/managers/${ultimateId}`),
        fetch(apiUrl + `/managers/${apexId}`),
    ])

    const [teamsUltimate, teamsApex] = await Promise.all([
        teamsUltimateRes.json(),
        teamsApexRes.json()
    ])

    return { teamsUltimate, teamsApex }
}

const sanitizeTeam = (matchupWeek: number, mc: any, players: any) => {
    const home = mc[0]
    const away = mc[1]

    const homeStarters = home.starters
    const awayStarters = away.starters
    const homePoints = home.points
    const awayPoints = away.points

    let homePointsTotal = 0
    let homeProjectionTotal = 0
    let awayPointsTotal = 0
    let awayProjectionTotal = 0

    const localStarters = []
    let winning = ""

    for (let i = 0; i < homeStarters.length; i++) {
        homePointsTotal += homePoints[i];

        const awayPoint = awayPoints ? awayPoints[i] : 0;

        awayPointsTotal += awayPoint;

        const home = digestStarter(homeStarters[i], homePoints[i], players, matchupWeek);
        const awayStarter = awayStarters ? awayStarters[i] : null;
        const away = digestStarter(awayStarter, awayPoint, players, matchupWeek);

        homeProjectionTotal += home.projection;
        awayProjectionTotal += away ? away.projection : 0;

        localStarters.push({ home, away });

        if (awayPointsTotal < homePointsTotal) winning = "home";
        else if (awayPointsTotal > homePointsTotal) winning = "away";
        else winning = "tied";
    }
    
    return {
        localStarters,
        homePointsTotal,
        awayPointsTotal,
        homeProjectionTotal,
        awayProjectionTotal,
        winning
    }
}

const digestStarter = (starter: any, points: any, players: any, displayWeek: number) => {
    if (!starter || starter == 0) {
        return {
            name: "Empty",
            avatar: null,
            poss: null,
            team: null,
            opponent: null,
            projection: 0,
            points: 0,
        };
    }

    const player = players[starter];

    let name = player?.pos == "DEF" ? player.ln : `${player?.fn[0]}. ${player?.ln}`;
    let projection = 0;

    if (player?.wi && player?.wi[displayWeek]) projection = parseFloat(player?.wi[displayWeek].p);

    return {
        name,
        avatar: player?.pos == "DEF" ? `url(https://sleepercdn.com/images/team_logos/nfl/${starter.toLowerCase()}.png)` : `url(https://sleepercdn.com/content/nfl/players/thumb/${starter}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`,
        pos: player?.pos,
        team: player?.t,
        opponent: player?.wi && player?.wi[displayWeek] ? player?.wi[displayWeek].o : null,
        projection,
        points
    }
}

export const AllMatchups = () => {
    const [matchups, setMatchups] = useState<any>({})
    const [teams, setTeams] = useState<any>({})
    const [players, setPlayers] = useState<any>()

    const [selectedOptions, setSelectedOptions] = useState<options>({
        ultimate: true,
        week: 1,
        details: null
    })

    useEffect(() => {
        getMatchups().then(matchups => {
            setMatchups(matchups);
        });

        getTeams().then(teams => {
            setTeams(teams)
        })
    }, [])

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await fetch(apiUrl + '/players')
            const result = await response.json()

            localStorage.setItem('players', JSON.stringify(result))
            localStorage.setItem('timestamp', new Date().toISOString());

            setPlayers(result)
        }

        const checkFetchCondition = () => {
            const localPlayers = localStorage.getItem('players')
            const timestamp = localStorage.getItem('timestamp')

            if (localPlayers && timestamp) {
                const lastFetch = new Date(timestamp)
                const now = new Date()

                // check if data was fetched before 00:00
                const isSameDay = lastFetch.toDateString() === now.toDateString()

                if (isSameDay) return false
            }

            return true
        }

        if (checkFetchCondition()) fetchPlayers();
        else {
            if (typeof global.window?.localStorage.getItem('players') === 'string') {
                setPlayers(JSON.parse(global.window?.localStorage.getItem('players') || '{"players": "undefined"}'))
            }
        }
    }, [])

    useEffect(() => {
        setSelectedOptions({ ...selectedOptions, week: matchups?.apexMatchups?.week })
    }, [matchups])

    const selectedMatchups = selectedOptions?.ultimate
        ? matchups?.ultimateMatchups?.matchupWeeks[selectedOptions.week]?.matchups
        : matchups?.apexMatchups?.matchupWeeks[selectedOptions.week]?.matchups

    const matchupsArray = selectedMatchups ? Object.values(selectedMatchups) : undefined

    const selectedTeams = selectedOptions.ultimate
        ? teams.teamsUltimate?.teamManagersMap[teams.teamsUltimate.currentSeason]
        : teams.teamsApex?.teamManagersMap[teams.teamsApex.currentSeason]

    if (!matchups?.apexMatchups) return (
        <div className="h-screen bg-zinc-800 pt-48">
            <p className="text-4xl text-center text-white">Loading...</p>
        </div>
    )
    console.log(selectedOptions)
    return (
        <section className="bg-zinc-800 py-14">
            <h1 className="text-4xl text-white text-center">{matchups?.apexMatchups?.year} Matchups</h1>

            <select name='weeks' className="flex mx-auto mt-6 rounded-md px-2 py-1 bg-zinc-900 
            text-white border-gold border-[1px]" defaultValue={matchups?.apexMatchups?.week}
                onChange={(e) => setSelectedOptions({ ...selectedOptions, week: parseInt(e.target.value) })}>
                {matchups?.apexMatchups?.matchupWeeks.map((m: any, index: number) =>
                    <option value={index + 1} key={index}>Week {index + 1}</option>)}
            </select>

            <div className="flex flex-row mx-auto w-fit mt-6">
                <button className={`rounded-l-xl font-semibold uppercase w-[120px] py-2 transition-all duration-300
                ${selectedOptions.ultimate ? 'bg-gold text-zinc-800' : 'bg-zinc-900 text-gray-500'}`}
                    onClick={() => setSelectedOptions({ ...selectedOptions, ultimate: true })}>
                    Ultimate
                </button>

                <button className={`rounded-r-xl font-semibold uppercase w-[120px] py-2 transition-all duration-300
                ${!selectedOptions.ultimate ? 'bg-gold text-zinc-800' : 'bg-zinc-900 text-gray-500'}`}
                    onClick={() => setSelectedOptions({ ...selectedOptions, ultimate: false })}>
                    Apex
                </button>
            </div>

            <div className="flex flex-col mx-auto w-fit gap-y-3 mt-12">
                {matchupsArray?.map((m: any, index: number) =>
                    <div key={index} className="flex flex-col">
                        <button className="flex flex-row w-[550px] items-center 
                        border-[1px] border-gold rounded-lg px-3 py-2 bg-zinc-900"
                        onClick={() => setSelectedOptions({ ...selectedOptions, details: selectedOptions.details === index ? null : index })}>
                            <div className="flex flex-row w-1/2 pr-2 items-center">
                                <div className="flex flex-row items-center gap-x-3">
                                    <img src={selectedTeams[m[0].roster_id].team.avatar}
                                        className="rounded-full h-9 w-9" />

                                    <span className="text-gray-200 w-[14ch]">
                                        {selectedTeams[m[0].roster_id].team.name}
                                    </span>
                                </div>

                                <div className="flex flex-col text-center ml-auto">
                                    <span className="text-gray-200 text-md">
                                        {sanitizeTeam(selectedOptions.week, m, players)?.homePointsTotal.toFixed(2)}
                                    </span>

                                    <span className="text-gray-400 text-xs">
                                        {sanitizeTeam(selectedOptions.week, m, players)?.homeProjectionTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-row ml-auto w-1/2 pl-2 border-gold border-l-[1px] items-center">
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-200 text-md">
                                        {sanitizeTeam(selectedOptions.week, m, players)?.awayPointsTotal.toFixed(2)}
                                    </span>

                                    <span className="text-gray-400 text-xs">
                                        {sanitizeTeam(selectedOptions.week, m, players)?.awayProjectionTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex flex-row items-center gap-x-3 ml-auto">
                                    <span className="text-gray-200 text-right w-[14ch]">
                                        {selectedTeams[m[1].roster_id].team.name}
                                    </span>

                                    <img src={selectedTeams[m[1].roster_id].team.avatar}
                                        className="rounded-full h-9 w-9" />
                                </div>
                            </div>
                        </button>

                        <div className={`bg-black rounded-lg flex-col text-white border-gold border-[1px] mt-1 ${selectedOptions.details === index ? 'flex' : 'hidden'}`}>
                            {sanitizeTeam(selectedOptions.week, m, players)?.localStarters.map((s: any, indexS: number) =>
                                <div key={indexS} className="flex flex-row [&:not(:last-child)]:border-b-[1px] border-gold">
                                    <div className="flex flex-row items-center w-1/2 py-1">
                                        <div className="rounded-lg w-7 h-7 flex justify-center text-sm ml-2"
                                        style={{ backgroundColor: `var(--${s?.home.pos})` }}>
                                            <span className="flex my-auto">{s?.home.pos}</span>
                                        </div>

                                        <div className="flex flex-row ml-3 items-center gap-x-3">
                                            <div className={`h-14 w-14 rounded-full bg-black relative`}
                                                style={{ backgroundImage: s?.home.avatar, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-md">
                                                    {s?.home.name}
                                                </span>

                                                <span className="text-xs text-gray-400 italic">
                                                    {(s?.home.team || 'N/A') + ' vs ' + (s?.home.opponent || 'N/A')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col ml-auto text-center mr-2">
                                            <span className="text-sm">
                                                {s?.home.points.toFixed(2)}
                                            </span>

                                            <span className="text-xs text-gray-400">
                                                {s?.home.projection.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center w-1/2 border-l-[1px] border-gray-500 py-1">
                                        <div className="flex flex-col text-center ml-2">
                                            <span className="text-sm">
                                                {s?.away.points.toFixed(2)}
                                            </span>

                                            <span className="text-xs text-gray-400">
                                                {s?.away.projection.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex flex-row items-center gap-x-3 ml-auto mr-3">
                                            <div className="flex flex-col text-right">
                                                <span className="text-md">
                                                    {s?.away.name}
                                                </span>

                                                <span className="text-xs text-gray-400 italic">
                                                    {(s?.away.team || 'N/A') + ' vs ' + (s?.away.opponent || 'N/A')}
                                                </span>
                                            </div>

                                            <div className={`h-14 w-14 rounded-full bg-black relative`}
                                                style={{ backgroundImage: s?.away.avatar, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                            </div>
                                        </div>

                                        <div className="rounded-lg w-7 h-7 flex justify-center text-sm mr-2"
                                        style={{ backgroundColor: `var(--${s?.away.pos})` }}>
                                            <span className="flex my-auto">{s?.away.pos}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button className="w-full bg-zinc-800 text-gray-200 rounded-b-lg 
                            py-2 hover:bg-zinc-700 transition-all duration-150"
                            onClick={() => setSelectedOptions({ ...selectedOptions, details: null })}>
                                Close Matchup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}