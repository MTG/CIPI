import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import { API_HOST } from '@/config'
import { PieceGraph, grayscaleHex, mapRange } from '../components/GraphExplorer'
import { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/AuthContext'
import { PieceCard } from '@/components/PieceCard'
import { useHasUserData } from '@/hooks/useHasUserData'

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

const SearchFilter = ({ setFilter }) => {
  const [period, setPeriod] = useState("");
  const [minDifficulty, setMinDifficulty] = useState(1);
  const [maxDifficulty, setMaxDifficulty] = useState(9);

  const handlePeriodChange = (event) => setPeriod(event.target.value);
  const handleMinDifficultyChange = (event) => setMinDifficulty(event.target.value);
  const handleMaxDifficultyChange = (event) => setMaxDifficulty(event.target.value);

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
    </div>
  );
};

const Skeleton = () => {
  return <div className={'items-center w-5/6 flex flex-1 flex-col overflow-hidden'}>
      <ul className="w-3/4 flex-1 overflow-y-auto animate-pulse">
      {[...Array(7)].map(key => <div key={key} role="status" class="mt-3 flex items-center justify-center h-20 bg-gray-200 rounded-lg animate-pulse">
          <span class="sr-only">Loading...</span>
      </div>)}
      </ul>
    </div>
}
const ListExplorer = ({ pieces, filter }) => {
  const router = useRouter();
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  if (pieces === null) return <Skeleton />

  const itemsPerPage = 7;
  const pagesPerSet = 10; // Number of pages per set
  const totalPages = Math.ceil((pieces?.length ?? 0) / itemsPerPage);

  const handlePieceSelection = (piece) => {
    setSelectedPiece(piece);
    router.push(`/pieces/${piece.id}`);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const displayedPieces = pieces.slice(firstIndex, lastIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };


  const renderPageButtons = () => {
    const currentPageSet = Math.ceil(currentPage / pagesPerSet);
    const lastPageSet = Math.ceil(totalPages / pagesPerSet);

    const startPage = (currentPageSet - 1) * pagesPerSet + 1;
    const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

    const buttons = [];

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          className={`mx-1 px-3 py-1 rounded-md ${
            currentPage === page ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => goToPage(page)}
        >
          {page}
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
       {displayedPieces.map((piece) => (
          <li key={piece.id}>
           <div
             className={`my-5 border p-4 rounded-md hover:bg-gray-100 cursor-pointer ${
                selectedPiece === null ? '' : ''
             }`}
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

export const GraphExplorer = ({ pieces }) => {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const getPieceColor = ({ piece, isHovered, isSelected }) => {
    const mappedDifficulty = 1 - mapRange((piece.difficulty.x1 + piece.difficulty.x2) / 2, -5, 5, 0.2, 0.7);
    if (isSelected) return '#dc2626';
    if (isHovered) return grayscaleHex(mappedDifficulty - 0.2);
    return grayscaleHex(mappedDifficulty);
  };
  return <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
    <PieceCard selectedPiece={selectedPiece} />
    <PieceGraph
      pieces={pieces}
      onSelectPiece={setSelectedPiece}
      selectedPiece={selectedPiece}
      getPieceColor={getPieceColor}
      isPieceSelectable={() => true}
      radius = {0.0125/2}
      initZoom = {300}
    />
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
  const router = useRouter();
  const hasData = useHasUserData();

  const [searchFilter, setSearchFilter] = useState({
    period: '',
    minDifficulty: 1,
    maxDifficulty: 9,
    query: ''});

  const {requireLogin, credential } = useContext(AuthContext);

  const handleSearch = (searchTerm) => {
    setSearchFilter({...searchFilter, query: searchTerm})
  };

  useEffect(() => {
    const { period, minDifficulty, maxDifficulty, query } = searchFilter;
    setPieces(null)
    getPieces(1000, 1, period, minDifficulty, maxDifficulty, query)
      .then((r) => {
        setPieces(r['array']);
      });
  }, [searchFilter])
  
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
      <main className="min-h-screen flex flex-col w-screen h-screen overflow-hidden p-4 overflow-hidden relative">
        <div className="flex pb-4">
          <MapModeToggle mapMode={mapMode} setMapMode={setMapMode} />
          <div className="font-bold text-gray-600 flex-1 text-center">CIPI</div>
         <button className="bg-black text-white rounded hover:bg-gray-800 hover:bg-gray-800 text-white py-2 px-4 text-sm" onClick={handleSurveyUploadPDF}>Upload PDF</button>
        </div>
        <div className="flex justify-center ">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex justify-center">
          <SearchFilter setFilter={setSearchFilter} />
        </div>
        {mapMode && (
          <div className="flex justify-center content-center flex-1 bg-white overflow-hidden">
            <GraphExplorer pieces={pieces} />
          </div>
        )}
        {!mapMode && (
          <div className="flex justify-center flex-1 overflow-hidden">
            <ListExplorer pieces={pieces} filter={searchFilter} />
          </div>
        )}
      </main>
      <footer className="bg-white py-4 flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <img src="/UPFLogo.png" alt="GitHub Logo" className="h-10 mb-2" />
          <div className="text-gray-600 text-sm">
            <p className="mb-1">
              This is an Open Source project performed by a group of students from UPF.
            </p>
            <p className="mb-0">
              All collected data will be used for academic purposes only.
            </p>
          </div>
        </div>
        <a href="https://github.com/miquelvir/CIPI.git" target="_blank" rel="noopener noreferrer" className=" text-gray-600 text-sm block underline hover:text-blue-500">
          CIPI GitHub
        </a>    
      </footer>  
    </>
  );
}
