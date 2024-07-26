import { WebFooter } from "@/components/footer";
import { AllMatchups } from "@/components/matchups";
import { WebNav } from "@/components/nav";

export default function ScoresPage() {
    return (
        <main className="flex flex-col">
            <WebNav />

            <AllMatchups />
            
            <WebFooter />
        </main>
    );
};