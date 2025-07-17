import Image from "next/image";
import MarketHero from "../components/marketHero";
import MarketFilter from "../components/marketFilter";
import CreditContainer from "../components/creditContainer";

export default function Home() {
  return (
    <div className="">
      <MarketHero />
      <section id="marketplace" className="py-12">
        <div className="max-w-7xl mx-auto px-6">
            <MarketFilter />
            <CreditContainer />
            <div className="text-center mt-12">
                    <button  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors">
                        Load More Credits
                    </button>
                    <p className="text-sm text-gray-500 mt-2">Showing 6 of 450+ available credits</p>
                </div>
        </div>
      </section>
    </div>
  );
}
