import React, { useState } from 'react';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';
import { useTooltip, TooltipWithBounds } from '@visx/tooltip';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

const initialTransform = (width, height, initZoom) => ({
    scaleX: initZoom,
    scaleY: initZoom,
    translateX: width / 2,
    translateY: height / 2,
    skewX: 0,
    skewY: 0,
});

const PieceGraphCanva = ({ width, height, pieces, onSelectPiece, getPieceColor, isPieceSelectable, bg = '#ffffff' , radius, initZoom}) => {
    const [hoveringPiece, setHoveringPiece] = useState(null)
    const [selectedPiece, setSelectedPiece] = useState(null)

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();
    
    const handleMouseOver = (event, piece) => {
        const coords = localPoint(event.target.ownerSVGElement, event);
        showTooltip({
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
            tooltipData: piece
        });
    };

    console.log(initZoom)
    if (!width && !height) return <></>
    return (
        <>
            <Zoom
                width={width}
                height={height}
                scaleXMin={110}
                scaleXMax={5000}
                scaleYMin={110}
                scaleYMax={5000}
                initialTransformMatrix={initialTransform(width, height, initZoom)}
            >
                {(zoom) => {
                    const onDragStart = (e) => {
                        hideTooltip()
                        setHoveringPiece(null)
                        zoom.dragStart(e)
                    }
                    return <div className="relative">
                        <svg
                            width={width}
                            height={height}
                            className={'touch-none ' + (zoom.isDragging ? 'cursor-grabbing' : 'cursor-grab')}
                            ref={zoom.containerRef}

                        >
                            <RectClipPath id="zoom-clip" width={width} height={height} />
                            <rect width={width} height={height} rx={14} fill={bg} />
                            <rect
                                width={width}
                                height={height}
                                rx={14}
                                fill="transparent"
                                onTouchStart={onDragStart}
                                onTouchMove={zoom.dragMove}
                                onTouchEnd={zoom.dragEnd}
                                onMouseDown={onDragStart}
                                onMouseMove={zoom.dragMove}
                                onMouseUp={zoom.dragEnd}
                                onMouseLeave={() => {
                                    if (zoom.isDragging) zoom.dragEnd();
                                }}
                            />
                            <g transform={zoom.toString()}>
                                {pieces.map((piece, i) => {
                                    const { difficulty, bg } = piece;
                                    const x = difficulty.x1/9 - 0.5;
                                    const y = 1 - difficulty.x2/9 - 0.5;
                                    return <React.Fragment key={`dot-${i}`}>
                                        <circle
                                            className={isPieceSelectable(piece) && "cursor-pointer"}
                                            cx={x}
                                            cy={y}
                                
                                            r={radius}
                                            fill={getPieceColor({piece, isHovered: hoveringPiece === piece, isSelected: selectedPiece === piece })}
                                            onClick={(e) => {
                                                if (!isPieceSelectable(piece)) return
                                                onSelectPiece(piece)
                                                setSelectedPiece(piece)
                                            }}
                                            onMouseOver={e => {
                                                if (piece.title) {
                                                    setHoveringPiece(piece)
                                                    handleMouseOver(e, piece)
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (piece.title) {
                                                    setHoveringPiece(null)
                                                }
                                                if (tooltipData === piece){
                                                    hideTooltip();
                                                }
                                            }}
                                        />
                                    </React.Fragment>
                                })}

                            </g>

                        </svg>

                        {tooltipOpen && (
                            <TooltipWithBounds top={tooltipTop} left={tooltipLeft}>
                                <div className="p-2" >
                                    <h2 className="font-medium text-lg">{tooltipData?.title}</h2>
                                    <h3 className="text-md">{tooltipData?.author}</h3>
                                </div>
                            </TooltipWithBounds>
                        )}
                    </div>
                }}
            </Zoom>
        </>
    );
}

export const PieceGraph = ({ pieces, onSelectPiece, getPieceColor, isPieceSelectable, radius, initZoom}) => {
    
    return  <div className="relative flex flex-1 max-w-full overflow-hidden my-2">
                <ParentSize debounceTime={10}>
                    {({ width: vw, height: vh }) => (
                        <PieceGraphCanva 
                            width={vw} 
                            height={vh} 
                            pieces={pieces} 
                            onSelectPiece={onSelectPiece} 
                            getPieceColor={getPieceColor}
                            isPieceSelectable={isPieceSelectable}
                            radius = {radius}
                            initZoom = {initZoom}
                        />
                    )}
                </ParentSize>
                <span className="bottom-0 left-5 absolute underline underline-offset-4 text-gray-600 select-none">easier</span>
                <span className="top-0 right-5 absolute underline underline-offset-4 text-gray-600 select-none">harder</span>
            </div>
}

export const grayscaleHex = (value) => {
    const intValue = Math.round(value * 255);
    const hexValue = intValue.toString(16).padStart(2, '0');
    return `#${hexValue}${hexValue}${hexValue}`;
  }
  
  export const mapRange = (value, fromMin, fromMax, toMin, toMax) => {
    const range = fromMax - fromMin;
    const scaledValue = (value - fromMin) / range;
    const toRange = toMax - toMin;
    return (scaledValue * toRange) + toMin;
  }
  