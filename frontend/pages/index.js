import Head from 'next/head'
import { useEffect, useState, useContext } from 'react'
import { API_HOST } from '@/config'
import { PieceGraph } from '../components/GraphExplorer'
import { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/AuthContext'

const MapModeToggle = ({ mapMode, setMapMode }) => {
  return <label className="relative inline-flex items-center mr-5 cursor-pointer">
    <input type="checkbox" value="" className="sr-only peer" checked={mapMode} onChange={() => setMapMode(x => !x)} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
    <span className="ml-3 text-sm font-medium text-gray-600">Map mode</span>
  </label>;
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
    <form onSubmit={handleSubmit} className="relative flex items-center w-80">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search a piece or author"
        className="w-64 px-4 py-2 text-gray-900 bg-gray-100 rounded-l-md focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline"
      >
        Search
      </button>
    </form>
  );
};

const SearchFilter = ({ onFilterChange }) => {
  const [key, setKey] = useState("");
  const [period, setPeriod] = useState("");
  const [min_difficulty, setMinDifficulty] = useState("");
  const [max_difficulty, setMaxDifficulty] = useState("");


  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };
  const handleMinDifficultyChange = (event) => {
    setMinDifficulty(event.target.value);
  };
  const handleMaxDifficultyChange = (event) => {
    setMaxDifficulty(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange({ key, period, min_difficulty, max_difficulty });
  };

  return (
    <form className="flex flex-wrap items-center justify-center my-4" onSubmit={handleSubmit}>
      <select
        value={key}
        onChange={handleKeyChange}
        className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      >
        <option value="">Select Signature Key</option>
        <option value="">C major/A minor</option>
        <option value="">G major/E minor</option>
        <option value="">D major/B minor</option>
        <option value="">A major/F sharp minor</option>
        <option value="">E major/C sharp minor</option>
        <option value="">B major/G sharp minor</option>
        <option value="">F sharp major/D sharp minor</option>
        <option value="">C sharp major/B sharop minor</option>
        <option value="">F major/D minor</option>
        <option value="">B flat major/G minor</option>
        <option value="">E flat major/C minor</option>
        <option value="">A flat major/F minor</option>
        <option value="">D flat major/B flat minor</option>
        <option value="">G flat major/E flat minor</option>
        <option value="">C flat major/A flat minor</option>       
      </select>
      <select
        value={period}
        onChange={handlePeriodChange}
        className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0" >
        <option value="">Select Period</option>
        <option value="Romantic">Romantic</option>
        <option value="Classical">Classical</option>
        <option value="Early-20th">Early-20th</option>
        <option value="Modern">Modern</option>
        </select>
      <div className="flex flex-col mr-2 mb-2 sm:mb-0">
        <label htmlFor="minDifficulty" className="text-gray-900">
          Minimum Difficulty: {min_difficulty}
        </label>
        <input
          type="range"
          id="minDifficulty"
          min="1"
          max="9"
          value={min_difficulty}
          onChange={handleMinDifficultyChange}
          className="cursor-pointer bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="flex flex-col mr-2 mb-2 sm:mb-0">
        <label htmlFor="maxDifficulty" className="text-gray-900">
          Maximum Difficulty: {max_difficulty}
        </label>
        <input
          type="range"
          id="maxDifficulty"
          min="1"
          max="9"
          value={max_difficulty}
          onChange={handleMaxDifficultyChange}
          className="cursor-pointer bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <button
        type="submit"
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      >
        Filter
      </button>
    </form>
  );
};


const ListExplorer = ({ pieces, filter }) => {
  const router = useRouter();
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const pagesPerSet = 10; // Number of pages per set
  const totalPages = Math.ceil(pieces.length / itemsPerPage);

  const handlePieceSelection = (piece) => {
    setSelectedPiece(piece);
    router.push(`/pieces/${piece.id}`);
  };

  // Apply the period filter
  const filteredPieces = filter?.period
    ? pieces.filter((piece) => piece.period === filter.period)
    : pieces;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const displayedPieces = filteredPieces.slice(firstIndex, lastIndex);

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

const SelectedPieceCard = ({ selectedPiece }) => {
  const router = useRouter()
  const onGoToPiece = () => {
    if (selectedPiece === null) return;
    router.push(`/pieces/${selectedPiece?.id}`)
  };
  return <div onClick={onGoToPiece} className={`border p-4 rounded-md flex ${selectedPiece === null ? '' : 'cursor-pointer hover:bg-zinc-50'}`}>
    <div className={`grow ${selectedPiece === null ? 'text-gray-400' : ''}`}>
      <div className="flex mb-1">
        <div className={`rounded-full mr-2 mt-1.5 w-4 h-4 ${selectedPiece === null ? 'bg-red-300' : 'bg-red-600'}`} />
        <div className="flex flex-col">
          <span className="font-medium text-lg ">{selectedPiece?.title ?? 'Select a piece'}</span>
          <span className="text-md">{selectedPiece?.author ?? '...'}</span>
        </div>
      </div>
    </div>
    <div className="">
      <button className={`grow-0 rounded-md text-white font-medium p-2  ${selectedPiece === null ? 'bg-gray-300 cursor-default' : 'cursor-pointer  bg-black hover:bg-gray-800 '}`}>
        Learn more
      </button>
    </div>
  </div>
}

const grayscaleHex = (value) => {
  const intValue = Math.round(value * 255);
  const hexValue = intValue.toString(16).padStart(2, '0');
  return `#${hexValue}${hexValue}${hexValue}`;
}

function mapRange(value, fromMin, fromMax, toMin, toMax) {
  const range = fromMax - fromMin;
  const scaledValue = (value - fromMin) / range;
  const toRange = toMax - toMin;
  return (scaledValue * toRange) + toMin;
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
    <SelectedPieceCard selectedPiece={selectedPiece} />
    <PieceGraph
      pieces={pieces}
      onSelectPiece={setSelectedPiece}
      selectedPiece={selectedPiece}
      getPieceColor={getPieceColor}
      isPieceSelectable={() => true}
    />
  </div>
}

const getPieces = async (sz, pg, k, pr, mind, maxd) => {
  const response = await fetch(`${API_HOST}/api/pieces?` + new URLSearchParams({
    size: sz, 
    page: pg,
    key: k,
    period: pr,
    min_difficulty: mind,
    max_difficulty: maxd}))

  const body = await response.json();
  return body;
}

const getProtectedEndpointDemo = async (credential) => {
  const response = await fetch(`${API_HOST}/api/demoAuth`, 
    {
      headers: {
        Authentication: `Bearer ${credential}`
      }
    }
  );
  const body = await response.json();
  return body;
}

export default function Home() {
  const [pieces, setPieces] = useState([]);
  const [mapMode, setMapMode] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchFilter, setSearchFilter] = useState({
    key: '',
    period: '',
    min_difficulty: null,
    max_difficulty: null});


  const { requireLogin, credential } = useContext(AuthContext);

//size, page, key, period, min and max difficulty
  useEffect(() => {
  const { key, period, min_difficulty, max_difficulty } = searchFilter;
  getPieces(1000, 1, key, period, min_difficulty, max_difficulty)
    .then(r => setPieces(r['array']))
  }, []);
 
// hardcode that works
// useEffect(() => {
// getPieces(1000, 1, 'F major', 'Modern', 1, 9).then(r => setPieces(r['array']))
// }, []);  

  // demo calling an endpoint that needs login
  useEffect(() => {
    if (credential === null) return;
    getProtectedEndpointDemo(credential).then(r => console.log(r))
  }, [credential])

  const handleSearch = (searchTerm) => {
    const filteredPieces = pieces.filter((piece) => {
      const { title, period, author } = piece;
      const searchLower = searchTerm.toLowerCase();
      // Check if the search term is present in the title, period, or author
      return (
        title.toLowerCase().includes(searchLower) ||
        period.toLowerCase().includes(searchLower) ||
        author.toLowerCase().includes(searchLower)
      );
    });
  
    setSearchResult(filteredPieces);
  };

  const handleFilterChange = (filter) => {
    setSearchFilter(filter);
  };


  const filteredPieces = searchFilter?.period
    ? searchResult?.filter((piece) => piece.period === searchFilter.period) || []
    : pieces;

    console.log(searchFilter)

    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    //Store PDF in folder to be read with OMR
    console.log("Uploaded file:", file);
  };

  // example of how to use the login
  useEffect(() => {
    let timer = window.setTimeout(() => {
      if (mapMode === true) requireLogin({ allowSkip: true, skipTimeoutSeconds: 60 })
    }, 1000);
  
    return () => window.clearTimeout(timer);
  }, [mapMode])

  return (
    <>
      <Head>
        <title>Can I Play It?</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />

      </Head>
      <main className="min-h-screen flex flex-col w-screen h-screen overflow-hidden p-2 overflow-hidden">
        <div>
          <MapModeToggle mapMode={mapMode} setMapMode={setMapMode} />
        </div>
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <label htmlFor="file-upload">
            <span className="text-sm font-medium text-gray-600 cursor-pointer">
              Upload PDF
            </span>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex justify-center">
          <SearchFilter onFilterChange={handleFilterChange} />
        </div>
        {mapMode && (
          <div className="flex justify-center content-center flex-1 bg-white overflow-hidden">
            <GraphExplorer pieces={pieces} />
          </div>
        )}
        {!mapMode && <div className="flex justify-center flex-1 overflow-hidden">
          <ListExplorer pieces={searchResult?.length > 0 ? searchResult : filteredPieces} filter={searchFilter} />
        </div>}
      </main>
    </>
  );
}
