import Link from "next/link"

export const WebFooter = () => {
    const footerLinks = [
        { item: 'Home', link: '/' }, { item: 'Scores', link: '/scores' }, { item: 'Standings', link: '/' },
        { item: 'Teams', link: '/' }, { item: 'Playoffs', link: '/' }, { item: 'Records', link: '/' },
        { item: 'Drafts', link: '/' }, { item: 'Playoffs', link: '/' }, { item: 'Awards', link: '/' },
        { item: 'Resources', link: '/' }
    ]

    return (
        <footer className="bg-neutral-950 w-full border-t-[3px] border-gold z-50 py-4 px-4">
            <div className="flex flex-row text-gray-400 gap-x-4 mx-auto w-fit flex-wrap justify-center">
                {footerLinks.map((l, index) => 
                    <Link key={index} className="flex flex-row" href={l.link}>
                        <div className="cursor-pointer hover:underline hover:text-gray-200 transition-all duration-300">
                            {l.item}
                        </div>
                        
                        {(l === footerLinks[footerLinks.length - 1]) ? null : <div className="ml-4">•</div>}
                    </Link>
                )}
            </div>
        </footer>
    )
}