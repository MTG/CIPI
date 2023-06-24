import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import { API_HOST } from '@/config'
import { PieceGraph, grayscaleHex, mapRange } from '../components/GraphExplorer'
import { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/AuthContext'
import { PieceCard } from '@/components/PieceCard'
import { useHasUserData } from '@/hooks/useHasUserData'
import { Footer } from '../components/Footer'

const MapModeToggle = ({ mapMode, setMapMode }) => {
  return <div><label className="relative inline-flex items-center mr-5 cursor-pointer">
    <input type="checkbox" value="" className="sr-only peer" checked={mapMode} onChange={() => setMapMode(x => !x)} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
    <span className="ml-3 text-sm font-medium text-gray-600">Map mode</span>
  </label></div>;
}

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-lg">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search a piece or author"
        className="w-full px-4 py-2 border-solid border-2 border-gray-200 rounded-md focus:outline-none"
      />
    </form>
  );
};

const SearchFilter = ({ setFilter, showResultsPerPage, setSize, size }) => {
  const [period, setPeriod] = useState("");
  const [minDifficulty, setMinDifficulty] = useState(1);
  const [maxDifficulty, setMaxDifficulty] = useState(9);

  const handlePeriodChange = (event) => setPeriod(event.target.value);
  const handleMinDifficultyChange = (event) => setMinDifficulty(event.target.value);
  const handleMaxDifficultyChange = (event) => setMaxDifficulty(event.target.value);
  const handleSizeChange = (event) => setSize(event.target.value)

  useEffect(() => {
    setFilter(x => ({...x, period, minDifficulty, maxDifficulty }));
  }, [period, minDifficulty, maxDifficulty])

  return (
    <div className="flex flex-wrap items-center justify-center my-4">
      <select
        value={period}
        onChange={handlePeriodChange}
        className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0 text-sm" >
        <option value="">All periods</option>
        <option value="Early Romantic">Early Romantic</option>
        <option value="Romantic">Romantic</option>
        <option value="Late Romantic">Late Romantic</option>
        <option value="Classical">Classical</option>
        <option value="Baroque">Baroque</option>
        <option value="Early 20th century">Early 20th century</option>
        <option value="Modern">Modern</option>
        </select>
        <select
            value={minDifficulty}
            onChange={handleMinDifficultyChange}
            className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0 text-sm" >
            <option value={1}>Difficulty &ge; 1</option>
            <option value={2}>Difficulty &ge; 2</option>
            <option value={3}>Difficulty &ge; 3</option>
            <option value={4}>Difficulty &ge; 4</option>
            <option value={5}>Difficulty &ge; 5</option>
            <option value={6}>Difficulty &ge; 6</option>
            <option value={7}>Difficulty &ge; 7</option>
            <option value={8}>Difficulty &ge; 8</option>
            <option value={9}>Difficulty &ge; 9</option>
          </select>
          <select
            value={maxDifficulty}
            onChange={handleMaxDifficultyChange}
            className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0 text-sm" >
            <option value={1}>Difficulty &le; 1</option>
            <option value={2}>Difficulty &le; 2</option>
            <option value={3}>Difficulty &le; 3</option>
            <option value={4}>Difficulty &le; 4</option>
            <option value={5}>Difficulty &le; 5</option>
            <option value={6}>Difficulty &le; 6</option>
            <option value={7}>Difficulty &le; 7</option>
            <option value={8}>Difficulty &le; 8</option>
            <option value={9}>Difficulty &le; 9</option>
          </select>
          {showResultsPerPage && <select
            value={size}
            onChange={handleSizeChange}
            className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0 text-sm" >
            <option value={10}>10 pieces</option>
            <option value={100}>100 pieces</option>
            <option value={1000}>1000 pieces</option>
            <option value={5000}>5000 pieces</option>
          </select>}
    </div>
  );
};

const getArray = (max) => {
  const result = []
  for (let i = 0; i < max; i++){
    result.push(i)
  }
  return result
}
const Skeleton = () => {
  return <div className={'items-center w-5/6 flex flex-1 flex-col overflow-hidden'}>
      <ul className="w-3/4 flex-1 overflow-y-auto animate-pulse">
      {getArray(10).map(key => <div key={key} role="status" className="mt-3 flex items-center justify-center h-20 bg-gray-200 rounded-lg animate-pulse">
          <span className="sr-only">Loading...</span>
      </div>)}
      </ul>
    </div>
}
const ListExplorer = ({ pieces, page, setPage, totalPages }) => {
  const router = useRouter();
  const pagesPerSet = 10; // Number of pages per set

  if (pieces === null) return <Skeleton />


  const handlePieceSelection = (piece) => {
    router.push(`/pieces/${piece.id}`);
  };

  const goToPage = (page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };

  const renderPageButtons = () => {
    const currentPageSet = Math.ceil(page / pagesPerSet);
    const lastPageSet = Math.ceil(totalPages / pagesPerSet);

    const startPage = (currentPageSet - 1) * pagesPerSet + 1;
    const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

    const buttons = [];

    for (let thisPage = startPage; thisPage <= endPage; thisPage++) {
      buttons.push(
        <button
          key={thisPage}
          className={`mx-1 px-3 py-1 rounded-md ${
            thisPage === page ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => goToPage(thisPage)}
        >
          {thisPage}
        </button>
      );
    }

    if (currentPageSet > 1) {
      buttons.unshift(
        <button
          key="prevSet"
          className="mx-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() => goToPage(startPage - 1)}
        >
          Prev
        </button>
      );
    }

    if (currentPageSet < lastPageSet) {
      buttons.push(
        <button
          key="nextSet"
          className="mx-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() => goToPage(endPage + 1)}
        >
          Next
        </button>
      );
    }

    return buttons;
  };
  
  return (
   <div className={'items-center w-5/6 flex flex-1 flex-col overflow-hidden'}>
      <ul className="w-3/4 flex-1 overflow-y-auto">
       {pieces.map((piece) => (
          <li key={piece.id}>
           <div
             className={`my-5 border p-4 rounded-md hover:bg-gray-100 cursor-pointer`}
             onClick={() => handlePieceSelection(piece)}
           >
              <div className={'ml-2 text-sm font-medium text-gray-600'}>
                {piece.author} - {piece.period.charAt(0).toUpperCase() + piece.period.slice(1)}
             </div>
             <div className={'ml-2 text-sm font-bold'}>{piece.title}</div>
            </div>
          </li>
       ))}
      </ul>
      <div className="flex justify-center mt-4">
        {renderPageButtons()}
     </div>
    </div>
  );
}

const GraphExplorerSkeleton = () => {
  return <div role="status" className="mt-3 flex items-center justify-center flex-1 bg-gray-200 rounded-lg animate-pulse">
  <span className="sr-only">Loading...</span>
</div>
}
export const GraphExplorer = ({ pieces }) => {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const getPieceColor = ({ piece, isHovered, isSelected }) => {
    const mappedDifficulty = 1 - mapRange((piece.difficulty.x1 + piece.difficulty.x2) / 2, -5, 5, 0.2, 0.7);
    if (isSelected) return '#dc2626';
    if (isHovered) return grayscaleHex(mappedDifficulty - 0.2);
    return grayscaleHex(mappedDifficulty);
  };
  return <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
    { pieces === null? <GraphExplorerSkeleton />:
    <><PieceCard selectedPiece={selectedPiece} />
    <PieceGraph
      pieces={pieces}
      onSelectPiece={setSelectedPiece}
      selectedPiece={selectedPiece}
      getPieceColor={getPieceColor}
      isPieceSelectable={() => true}
      radius={0.0125/2}
      initZoom={300}
      autoCenter={false}
    /></>
    }
    
  </div>
}

const getPieces = async (sz, pg, pr, mind, maxd, query) => {
  const response = await fetch(`${API_HOST}/api/pieces?` + new URLSearchParams({
    size: sz,
    page: pg,
    period: pr,
    min_difficulty: mind,
    max_difficulty: maxd,
    input_string: query}))

  const body = await response.json();
  return body;
}

export default function Home() {
  const [pieces, setPieces] = useState(null);
  const [mapMode, setMapMode] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    period: '',
    minDifficulty: 1,
    maxDifficulty: 9,
    query: ''});

  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [size, setSize] = useState(10)
  useEffect(() => {
    setPage(1)
    setSize(mapMode? 1000: 10)
  }, [mapMode])

  useEffect(() => {
    if (size === 0) return setTotalPages(0)
    setTotalPages(Math.ceil(totalResults / size))
  }, [size, totalResults])

  const router = useRouter();
  const hasData = useHasUserData();

  const {requireLogin, credential } = useContext(AuthContext);

  const handleSearch = (searchTerm) => {
    setSearchFilter({...searchFilter, query: searchTerm})
  };

  useEffect(() => {
    setPage(1)
  }, [searchFilter, size])

  useEffect(() => {
    const { period, minDifficulty, maxDifficulty, query } = searchFilter;
    setPieces(null)
    getPieces(size, page, period, minDifficulty, maxDifficulty, query)
      .then((r) => {
        setPieces(r['array']);
        setTotalResults(r['_links']['total_pages']);
      });
  }, [searchFilter, page, size])
  
  // example of how to use the login
  useEffect(() => {
    let timer = window.setTimeout(() => {
      if (mapMode === true) requireLogin({ allowSkip: true, skipTimeoutSeconds: 60 })
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [mapMode])

  const handleSurveyUploadPDF = () => {
    if (credential && !hasData) {
      router.push('/survey');
    } else {
      router.push('/upload');
    }
  };

  

  return (
    <>
      <Head>
        <title>Can I Play It?</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="min-h-screen flex flex-col w-screen overflow-hidden p-4 overflow-hidden relative">
        <div className="flex pb-4">
          <MapModeToggle mapMode={mapMode} setMapMode={setMapMode} />
          <div className="font-bold text-gray-600 flex-1 text-center">CIPI</div>
         <button className="bg-black text-white rounded hover:bg-gray-800 hover:bg-gray-800 text-white py-2 px-4 me-3 text-sm" onClick={handleSurveyUploadPDF}>Upload PDF</button>
        </div>
        <div className="flex justify-center ">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex justify-center">
          <SearchFilter setFilter={setSearchFilter} 
                        size={size} setSize={setSize} 
                        showResultsPerPage={true} />
        </div>
        {mapMode && (
          <div className="flex justify-center content-center flex-1 bg-white overflow-hidden">
            <GraphExplorer pieces={pieces} />
          </div>
        )}
        {!mapMode && (
          <div className="flex justify-center flex-1 overflow-hidden">
            <ListExplorer pieces={pieces} filter={searchFilter} totalPages={totalPages} setPage={setPage} page={page}/>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
