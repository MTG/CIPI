import Head from 'next/head'
import { useEffect, useState } from 'react'
import { API_HOST } from '../config'
import { PieceGraph } from '../components/GraphExplorer'
import { useRouter } from 'next/router'

const MapModeToggle = ({mapMode, setMapMode}) => {
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
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-80">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search a piece"
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
  const [author, setAuthor] = useState("");
  const [epoch, setEpoch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [signatureKey, setSignatureKey] = useState("");

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleEpochChange = (event) => {
    setEpoch(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleSignatureKeyChange = (event) => {
    setSignatureKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilters({ author, epoch, difficulty, signatureKey });
  };

  return (
    <form className="flex flex-wrap items-center justify-center my-4" onSubmit={handleSubmit}>
      <select
        value={author}
        onChange={handleAuthorChange}
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      >
        <option value="">Select Author</option>
        <option value="Author 1">Author 1</option>
        <option value="Author 2">Author 2</option>
        {/* Add more author options*/}
      </select>

      <select
        value={epoch}
        onChange={handleEpochChange}
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      >
        <option value="">Select Epoch</option>
        <option value="Epoch 1">Romantic</option>
        <option value="Epoch 2">Classical</option>
        <option value="Epoch 3">Early-20th</option>
        {/* Add more epoch options*/}
      </select>

      <select
        value={difficulty}
        onChange={handleDifficultyChange}
        className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mr-2 mb-2 sm:mb-0"
      >
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy (1-3)</option>
        <option value="Medium">Medium (4-6)</option>
        <option value="Hard">Hard (7-9)</option>
        {/* Add more difficulty options*/}
      </select>
    </form>
  );
};

const ListExplorer = ({pieces}) => {
  const router = useRouter()
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  const handlePieceSelection = (piece) => {
    setSelectedPiece(piece);
    router.push(`/pieces/${piece.id}`);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const displayedPieces = Array.isArray(pieces) ? pieces.slice(firstIndex, lastIndex) : [];
  const totalPages = Math.ceil(pieces.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return <div className={'items-center w-5/6'}>
    <ul>
      {displayedPieces.map((piece) => (
        <li key={piece.id}>
          <div className={`my-5 border p-4 rounded-md hover:bg-gray-100 ${selectedPiece === null? '' : '' }`}onClick={() => handlePieceSelection(piece)} >
            <div className={'ml-2 text-sm font-medium text-gray-600'}>{piece.author} - {piece.period.charAt(0).toUpperCase() + piece.period.slice(1)}</div>
            <div className={'ml-2 text-sm font-bold'}>{piece.title}</div>
          </div>
        </li>
      ))}
    </ul>
    <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => goToPage(index + 1)}>
            {index + 1}
          </button>
        ))}
    </div>
  </div>
}

const SelectedPieceCard = ({ selectedPiece }) => {
  const router = useRouter()
  const onGoToPiece = () => {
    if (selectedPiece === null) return;
    router.push(`/pieces/${selectedPiece?.id}`)
  };
  return <div onClick={onGoToPiece} className={`border p-4 rounded-md flex ${selectedPiece === null? '': 'cursor-pointer hover:bg-zinc-50'}`}>
      <div className={`grow ${selectedPiece === null? 'text-gray-400': ''}`}>
          <div className="flex mb-1">
              <div className={`rounded-full mr-2 mt-1.5 w-4 h-4 ${selectedPiece === null? 'bg-red-300': 'bg-red-600'}`}/>
              <div className="flex flex-col">
                  <span className="font-medium text-lg ">{selectedPiece?.title ?? 'Select a piece'}</span>
                  <span className="text-md">{selectedPiece?.author ?? '...'}</span>
              </div>
          </div>
      </div>
      <div className="">
          <button className={`grow-0 rounded-md text-white font-medium p-2  ${selectedPiece === null? 'bg-gray-300 cursor-default': 'cursor-pointer  bg-black hover:bg-gray-800 '}`}>
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
  const getPieceColor = ({piece, isHovered, isSelected }) => {
    const mappedDifficulty = 1-mapRange((piece.difficulty.x1+piece.difficulty.x2)/2, 0, 1, 0.2, 0.7);
    if (isSelected) return '#dc2626';
    if (isHovered) return grayscaleHex(mappedDifficulty-0.2);
    return grayscaleHex(mappedDifficulty);
};
  return  <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
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


export default function Home() {
  const [pieces, setPieces] = useState([]);
  const [mapMode, setMapMode] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);

  useEffect(() => {
    fetch(`${API_HOST}/pieces`).then(r => r.json()).then(r => setPieces(r['array']))
  }, []); 


  const handleSearch = (title) => {
    const piece = pieces.find((p) => (p.title === title));
    setSearchResult(piece ? { title: piece.title, period: piece.period, author: piece.author } : null);
  };

  const handleFilterChange = (event) => {
    setSearchFilter({ ...searchFilter, [event.target.name]: event.target.value });
  };

   const handleFileUpload = (event) => {
    const file = event.target.files[0];
    //Store PDF in folder to be read with OMR
    console.log("Uploaded file:", file);
  };

   return (
    <>
      <Head>
        <title>Can I Play It?</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="min-h-screen flex flex-col w-screen h-screen overflow-hidden p-2">
        <div>
          <MapModeToggle mapMode={mapMode} setMapMode={setMapMode} />
        </div>
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <label htmlFor="file-upload">
            <span className="text-sm font-medium text-gray-600 cursor-pointer">Upload PDF</span>    
            <input id="file-upload" type="file" accept=".pdf" onChange={handleFileUpload} className="hidden"/>
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
        {!mapMode && (
          <div className="flex justify-center">
            <ListExplorer pieces={searchResult ? [searchResult] : pieces} />
          </div>
        )}
      </main>
    </>
  );
}