'use client'

import { IoIosSunny } from "react-icons/io";
import { MdScoreboard } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { FaRegLightbulb } from "react-icons/fa";
import { FaPenToSquare, FaTrophy, FaTableCells } from "react-icons/fa6";
import { PiSquaresFourBold } from "react-icons/pi";
import { IoPodium } from "react-icons/io5";
import { BiMedal } from "react-icons/bi";
import { GiBoxingGlove } from "react-icons/gi";

import { useState } from "react";
import Link from "next/link";

export const WebNav = () => {
    const [historyDropdown, setHistoryDropdown] = useState(false)

    const navItems = [
        {
            item: 'Home',
            href: '/',
            logo: <IoIosSunny />
        },
        {
            item: 'Scores',
            href: '/scores',
            logo: <MdScoreboard />
        },
        {
            item: 'Standings',
            href: '/',
            logo: <IoPodium />
        },
        {
            item: 'Teams',
            href: '/',
            logo: <RiTeamFill />
        },
        {
            item: 'Playoffs',
            href: '/',
            logo: <FaPenToSquare />
        },
        {
            item: 'History',
            href: '/',
            logo: <PiSquaresFourBold />,
            dropdown: true,
            action: () => setHistoryDropdown(!historyDropdown)
        },
        {
            item: 'Resources',
            href: '/',
            logo: <FaRegLightbulb />
        }
    ]

    const dropdownItems = [
        {
            item: 'Records',
            logo: <BiMedal />
        },
        {
            item: 'Drafts',
            logo: <FaTableCells />
        },
        {
            item: 'Playoffs',
            logo: <GiBoxingGlove />
        },
        {
            item: 'Awards',
            logo: <FaTrophy />
        }
    ]

    return (
        <nav className="flex flex-col bg-neutral-950 pt-4 px-4 shadow-[#f9a825_1px_0px_30px_0px] z-50">
            <button className="absolute right-4">
                <IoIosSunny className="text-gray-200 text-2xl hover:text-gold transition-all duration-300" />
            </button>

            <img src="badge.png" className="h-20 w-20 mx-auto" />

            <div className="flex flex-row mx-auto mt-4 flex-wrap justify-center">
                {navItems.map((i, index) =>
                    <div className="relative" key={index}>
                        <Link onClick={i.action} className="flex flex-row items-center duration-150
                        gap-x-2 text-gray-200 hover:bg-gold hover:bg-opacity-10 px-4 py-4 transition-all"
                        href={i.href}>
                            <div className="text-xl">{i.logo}</div>

                            <div className="uppercase text-sm font-semibold">{i.item}</div>
                        </Link>

                        {!(i.dropdown) ? undefined :
                            <ul className={`absolute bg-neutral-950 w-full top-[100%] transition-all duration-300
                            flex flex-col text-white border-t-0 ${historyDropdown ? 'h-[210px]' : 'h-0'}`}>
                                {dropdownItems.map((di, dIndex) => 
                                    <li key={dIndex} className={`flex-row items-center gap-x-4 px-4 py-4
                                    [&:not(:last-child)]:border-b-[1px] border-zinc-800 ${historyDropdown ? 'flex' : 'hidden'}
                                    hover:bg-gold hover:bg-opacity-10 transition-all duration-300 cursor-pointer`}>
                                        <div className="text-xl">{di.logo}</div>
                                        <div className="text-sm">{di.item}</div>
                                    </li>
                                )}
                            </ul>
                        }
                    </div>
                )}
            </div>
        </nav>
    )
}