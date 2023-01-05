import React from 'react';

const BoardState = ({name, children = [], onMoveRight, onMoveLeft}) => {
    const onMoveCard = (event, child) => {
        // Move to stage +1
        if (event.type === 'click') onMoveRight(name, child);
        // Move to stage -1
        if (event.type === 'contextmenu') onMoveLeft(name, child);
    };
    return (
        <div className="stage-column">
            <div id="stage-name" className="stage-name">{name}</div>
            <div id="stage-container" className="stage-container">
                {children.length > 0
                    ? children.map((child) => (
                        <button
                            id="stage-item"
                            className="stage-item"
                            onContextMenu={(event) => onMoveCard(event, child)}
                            onClick={(event) => onMoveCard(event, child)}
                        >
                            {child}
                        </button>
                    ))
                    : null}
            </div>
        </div>
    );
};

export default React.memo(BoardState);
