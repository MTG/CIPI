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

const SearchFilter = ({ setFilters }) => {
  const [key, setKey] = useState("");
  const [period, setPeriod] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilters({ key, period, difficulty });
  };

  return (
    <form className="flex flex-wrap items-center justify-center my-4" onSubmit={handleSubmit}>
      <select
        value={key}
        onChange={handleKeyChange}
        className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      >
        <option value="">Select Key</option>
      </select>
      <select
        value={period}
        onChange={handlePeriodChange}
        className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0" >
        <option value="">Select Period</option>
        <option value="romantic">Romantic</option>
        <option value="classical">Classical</option>
        <option value="early-20th">Early-20th</option>
        <option value="modern">Modern</option>
      </select>
      <select
        value={difficulty}
        onChange={handleDifficultyChange}
        className="cursor-pointer px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
        >
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy (1-3)</option>
        <option value="Medium">Medium (4-6)</option>
        <option value="Hard">Hard (7-9)</option>
      </select>
    </form>
  );
}

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

const getPieces = async (sz, pg, k, pr/*, df*/) => {
  const response = await fetch(`${API_HOST}/api/pieces?` + new URLSearchParams({
    size: sz, 
    page: pg,
    key: k,
    period: pr}))
   // difficulty: ''}))

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
    difficulty: ''
  });


  const { requireLogin, credential } = useContext(AuthContext);

 //size, page, key, period, difficulty
  useEffect(() => {
    getPieces(1000, 1, 'F major', 'Classical').then(r => setPieces(r['array']))
  }, []);  

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

  const handleFilterChange = (event) => {
    setSearchFilter({ ...searchFilter, [name]: value });
  };

  const filteredPieces = searchFilter?.period
    ? searchResult.filter((piece) => piece.period === searchFilter.period)
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
          <SearchFilter filter={searchFilter} onFilterChange={handleFilterChange} />
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
