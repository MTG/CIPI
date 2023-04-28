/* eslint react/jsx-handler-names: "off" */
import React, { useState } from 'react';
import { Zoom, applyMatrixToPoint } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';
import genPhyllotaxis, {
    GenPhyllotaxisFunction,
    PhyllotaxisPoint,
} from '@visx/mock-data/lib/generators/genPhyllotaxis';
import { withTooltip, Tooltip } from '@visx/tooltip';

const bg = '#ffffff';


const initialTransform = (width, height) => ({
    scaleX: 300,
    scaleY: 300,
    translateX: width / 2,
    translateY: height / 2,
    skewX: 0,
    skewY: 0,
});

const ZoomI = ({ width, height, pieces }) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [hoveringPiece, setHoveringPiece] = useState(null)
    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();
    // If you don't want to use a Portal, simply replace `TooltipInPortal` below with
    // `Tooltip` or `TooltipWithBounds` and remove `containerRef`
    const { TooltipInPortal } = useTooltipInPortal({
        // use TooltipWithBounds
        detectBounds: true,
        // when tooltip containers are scrolled, this will correctly update the Tooltip position
        scroll: true,
    })
    const handleMouseOver = (event, piece) => {
        const coords = localPoint(event.target.ownerSVGElement, event);
        showTooltip({
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
            tooltipData: piece
        });
    };

    if (!width && !height) return <></>
    return (
        <>
            <Zoom
                width={width}
                height={height}
                scaleXMin={220}
                scaleXMax={1000}
                scaleYMin={220}
                scaleYMax={1000}
                initialTransformMatrix={initialTransform(width, height)}
            >
                {(zoom) => {
                    const onDragStart = (e) => {
                        hideTooltip()
                        setSelectedPiece(null)
                        setHoveringPiece(null)
                        zoom.dragStart(e)
                        if (selectedPiece) selectedPiece.bg = "#666666"
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
                                    const x = difficulty.x1;
                                    const y = difficulty.x2;
                                    return <React.Fragment key={`dot-${i}`}>
                                        <circle
                                            className={piece.title && "cursor-pointer"}
                                            cx={x}
                                            cy={y}
                                            r={0.05}
                                            fill={piece.title === null ? piece.bg : selectedPiece === piece ? '#222222' : hoveringPiece === piece ? '#444444' : '#666666'}
                                            onClick={(e) => {
                                                if (piece.title) {
                                                    setSelectedPiece(piece)
                                                    handleMouseOver(e, piece)
                                                }
                                            }}
                                            onMouseOver={e => {
                                                if (piece.title) {
                                                    setHoveringPiece(piece)
                                                }

                                            }}
                                            onMouseLeave={e => {
                                                if (piece.title) {
                                                    setHoveringPiece(null)
                                                }
                                            }}
                                        />
                                    </React.Fragment>
                                })}

                            </g>

                        </svg>

                        {tooltipOpen && (
                            <TooltipWithBounds
                                // set this to random so it correctly updates with parent bounds
                                key={Math.random()}
                                top={tooltipTop}
                                left={tooltipLeft}
                            >
                                <strong>{tooltipData?.title}</strong>
                            </TooltipWithBounds>
                        )}
                    </div>
                }}
            </Zoom>
        </>
    );
}

import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

export const GraphExplorer = ({ pieces }) => {
    return <><div className="app-graph ">
        <ParentSize debounceTime={10}>
            {({ width: visWidth, height: visHeight }) => (
                <ZoomI width={visWidth} height={visHeight} pieces={pieces} />
            )}
        </ParentSize>
    </div>

        <style jsx>{`
        .app {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: #ffffff;
        }
        .app-graph {
          display: flex;
          flex: 1;
          overflow: hidden;
          max-width: 100%;
          max-height: 100%;
        }
      `}</style></>
}
