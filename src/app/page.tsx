'use client'

import { WebFooter } from "@/components/footer";
import { WebNav } from "@/components/nav";
import { RecentTrades } from "@/components/recent-trades";
import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        const fetchPlayers = async () => {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL)
            
            const response = await fetch(apiUrl + '/players')
            const result = await response.json()

            localStorage.setItem('players', JSON.stringify(result))
            localStorage.setItem('timestamp', new Date().toISOString());
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
    }, [])

    return (
        <main className="flex flex-col">
            <WebNav />

            <div className="w-full flex md:flex-row flex-col">
                <section className="h-auto lg:w-1/3 md:w-1/2 w-full bg-zinc-900">
                    <RecentTrades />
                </section>

                <section className="lg:w-2/3 md:w-1/2 w-full bg-zinc-800 py-24">
                    <div className="w-2/3 mx-auto text-white">
                        <h1 className="text-center font-semibold text-xl">Dynasty Ultimate</h1>

                        <p className="mt-8 text-justify">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            <br /><br />
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                        </p>
                    </div>
                </section>
            </div>

            <WebFooter />
        </main>
    );
}