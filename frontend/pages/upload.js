import React, { useState, useEffect, useContext } from 'react'
import {useDropzone} from 'react-dropzone'
import Head from 'next/head'
import { Player } from '@lottiefiles/react-lottie-player'
import { API_HOST } from '@/config'
import { AuthContext } from '@/contexts/AuthContext'
import { DifficultyBar } from '@/components/DifficultyBar'
import { PieceGraph, grayscaleHex, mapRange } from '@/components/GraphExplorer'
import { PieceCard } from '@/components/PieceCard'

function Dropzone({ file, setFile, requireLogin }) {
    const noFileText = "Upload a PDF score";
    const [dropzoneText, setDropzoneText] = useState(noFileText)
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf']
        },
        onDrop: (acceptedFiles) => {
            requireLogin({ allowSkip: false }).then(isLoggedIn => {
                console.log(isLoggedIn)
                if (!isLoggedIn) return
                const selectedFile = acceptedFiles[0] === undefined? 
                    null : 
                    `${acceptedFiles[0]?.name} (${Math.round(acceptedFiles[0]?.size / 1000000 * 100) / 100}MB)`;
                setFile(acceptedFiles[0])
                setDropzoneText(selectedFile ?? noFileText)
            })
            
        }
    });

    return (
      <section>
        <div {...getRootProps({className: 'dropzone'})} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px',
                borderWidth: '2px',
                borderRadius: '2px',
                borderColor: '#eeeeee',
                borderStyle: 'dashed',
                backgroundColor: '#fafafa',
                color: '#bdbdbd',
                outline: null,
                cursor: 'pointer',
                transition: 'border .24s ease-in-out'
        }}>
          <input {...getInputProps()} />
          <p>{dropzoneText}</p>
        </div>
      </section>
    );
  }


const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
};

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const UploadStep = ({ file, setFile, nextStep, requireLogin }) => {
    return <>
        <div className="flex w-full items-center justify-center">
            <div className="flex-1 max-w-lg">
                <div className="mb-2 text-sm text-gray-600">Upload a piano score in PDF format to explore similar pieces.</div>
                <Dropzone file={file} setFile={setFile} requireLogin={requireLogin} />
                <div className="flex justify-end">
                    <button onClick={nextStep} className="bg-black justify-self-end text-white mt-5 rounded hover:bg-gray-800 disabled:bg-gray-200 disabled:hover:bg-gray-200 text-white py-2 px-4 text-sm" disabled={file === null}>Explore scores</button>
                </div>
            </div>
        </div>
    </>
}

  
const LoadingStep = ({ loadingStartTime }) => {
    const [days, hours, minutes, seconds] = useCountdown(loadingStartTime);
    const expired = days + hours + minutes + seconds <= 0;
    return <>
        <div className="flex w-full flex-col items-center justify-center">
            <Player
                autoplay
                loop
                src="https://assets6.lottiefiles.com/packages/lf20_euaveaxu.json"
                style={{ height: '300px', width: '300px' }}
                background="transparent"
                />
                <div className="mt-4 text-sm text-gray-600">
                    { expired ? 
                        `It is taking longer than expected... Wait a bit more ✨`
                        : `Give us ${minutes ?? 0}:${seconds ?? 0} minutes to analyze your score...` }

                </div>
        </div>
    </>
}

const ErrorStep = ({  }) => {
    return <>
        <div className="flex w-full flex-col items-center justify-center">
            <div className="mt-4 text-sm text-gray-600">
                Something failed. Try again later...
            </div>
        </div>
    </>
}

const ExploreStep = ({ file, difficulty, similarScores }) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const getPieceColor = ({ piece, isHovered, isSelected }) => {
        if (isSelected) return '#dc2626';
        if (piece.id === null) return '#ffa19c'
        const mappedDifficulty = 1 - mapRange((piece.difficulty.x1 + piece.difficulty.x2) / 2, -5, 5, 0.2, 0.7);
        if (isHovered) return grayscaleHex(mappedDifficulty - 0.2);
        return grayscaleHex(mappedDifficulty);
    };
    
    return <div className="max-w-2xl flex flex-col flex-1 w-full pt-16">
        <div className="text-2xl font-semibold pb-8">{file?.name}</div>
        <div className="text-sm font-semibold">Difficulty</div>
        <DifficultyBar filled={difficulty ? difficulty[0] / 9: 0} />
        
        <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
            <PieceCard selectedPiece={selectedPiece} />
            <PieceGraph
            pieces={similarScores}
            onSelectPiece={setSelectedPiece}
            selectedPiece={selectedPiece}
            getPieceColor={getPieceColor}
            isPieceSelectable={() => true}
            />
        </div>
    </div>
}

const STEP_SELECT = 'select';
const STEP_LOAD = 'load';
const STEP_EXPLORE = 'explore';
const STEP_ERROR = 'error';

const uploadPdf = async (credential, file) => {
    const formData = new FormData();
    formData.append('score', file);

    const response = await fetch(`${API_HOST}/api/pieces`, 
      {
        method: 'POST',
        headers: {
          Authentication: `Bearer ${credential}`
        },
        body: formData
      }
    );
    const body = await response.json();
    return body;
  }

export default function Upload() {
    const [step, setStep] = useState(STEP_SELECT)
    const [file, setFile] = useState(null)
    const [loadingStartTime, setLoadingStartTime] = useState(null)
    const { requireLogin, credential } = useContext(AuthContext);
    const [difficulty, setDifficulty] = useState(null)
    const [similarScores, setSimilarScores] = useState(null)

    const startUpload = () => {
        if (credential === null) return;

        const five_minutes = 5 * 60 * 1000;
        setLoadingStartTime(new Date().getTime() + five_minutes)
        setStep(STEP_LOAD)

        uploadPdf(credential, file).then(r => {
            setDifficulty(r.data.difficulty)
            setSimilarScores([{
                "url": null,
                "title": file?.name,
                "period": null,
                "author": null,
                "year": null,
                "difficulty": {
                    "x1": r.data.difficulty[0],
                    "x2": r.data.difficulty[0]
                },
                "id": null,
                "key": null
            }, ...r.data.pieces])
            setStep(STEP_EXPLORE)
        }).catch(() => setStep(STEP_ERROR))
    }

    return <>
        <Head>
            <title>Can I Play It? - upload score</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        <main className="min-h-screen items-center justify-center flex flex-col w-screen h-screen overflow-hidden p-4 overflow-hidden relative">
            { step === STEP_SELECT && <UploadStep file={file} setFile={setFile} nextStep={startUpload} requireLogin={requireLogin}/> }
            { step === STEP_LOAD && <LoadingStep loadingStartTime={loadingStartTime} /> }
            { step === STEP_EXPLORE && <ExploreStep difficulty={difficulty} similarScores={similarScores} file={file} /> }
            { step === STEP_ERROR && <ErrorStep /> }
        </main>
    </>
}