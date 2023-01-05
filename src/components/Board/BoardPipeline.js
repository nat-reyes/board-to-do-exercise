import React, { useState, useEffect } from 'react';
import './BoardStyle.css';
import BoardState from './BoardState.js';
const BoardPipeline = ({ stages }) => {
  const [assemblyStages, setAssemblyStages] = useState([]);
  const [inputStage, setInputStage] = useState('');

  const formatStageValues = () => {
    const stagesFormatted = [];
    stages.map((stage, idx) => stagesFormatted.push({ children: [`${stage}-${idx+1}-test`], name: stage }));
    setAssemblyStages(stagesFormatted);
  };
  useEffect(() => {
    formatStageValues();
  }, []);

  const onChangeAssemblyItem = (inputValue) => {
    setInputStage(inputValue);
  };

  const onUpdateAssemblyStages = (stageName, stageChildren, newChild = null) => {
    const assemblyStagesUpdated = assemblyStages.map((stage) => {
      let children = stageChildren;
      if (newChild) {
        children = stageChildren.length ? [newChild, ...stageChildren] : [newChild];
      }
      return stage.name === stageName ? { ...stage, children } : stage;
    });
    setAssemblyStages(assemblyStagesUpdated);
    return assemblyStagesUpdated;
  };
  const onCreateAssemblyItem = (event) => {
    const firstStage = assemblyStages[0].name;
    if (event.key === 'Enter') {
      const firstStageChildren = assemblyStages.find((stage) => stage.name === firstStage).children;
      onUpdateAssemblyStages(firstStage, firstStageChildren, inputStage);
      setInputStage('');
    }
  };

  const onUpdateCurrentAndNextStage = (
    currentStage,
    currentChildrenUpdated,
    currentStageIdx,
    newChild,
    moveType
  ) => {
    const currentUpdated = onUpdateAssemblyStages(currentStage, currentChildrenUpdated);
    //Update next stage
    const nextStageIdx = moveType === 'next' ? currentStageIdx + 1 : currentStageIdx - 1;
    const { children, name } = assemblyStages[nextStageIdx];
    const assemblyStagesUpdated = currentUpdated.map((stage) => {
      let childrenObj = [];
      if (moveType === 'next') childrenObj = children.length ? [newChild, ...children] : [newChild];
      if (moveType === 'previous')
        childrenObj = children.length ? [...children, newChild] : [newChild];
      return stage.name === name ? { ...stage, children: childrenObj } : stage;
    });
    setAssemblyStages(assemblyStagesUpdated);
  };

  const onMoveChildLeft = (stage, child) => {
    const stageIdx = assemblyStages.findIndex((item) => item.name === stage);
    const stageChildrenUpdated = assemblyStages[stageIdx].children.filter((item) => item !== child);
    // Is located in the first stage
    if (stageIdx === 0) return onUpdateAssemblyStages(stage, stageChildrenUpdated);
    onUpdateCurrentAndNextStage(stage, stageChildrenUpdated, stageIdx, child, 'previous');
  };

  const onMoveChildRight = (stage, child) => {
    const stageIdx = assemblyStages.findIndex((item) => item.name === stage);
    const stageChildrenUpdated = assemblyStages[stageIdx].children.filter((item) => item !== child);
    // Is located in the last stage
    if (assemblyStages.length - 1 === stageIdx) return onUpdateAssemblyStages(stage, stageChildrenUpdated);
    onUpdateCurrentAndNextStage(stage, stageChildrenUpdated, stageIdx, child, 'next');
  };
  const hasItemsToShow = assemblyStages.length > 0;


  return (
    <>
      <div id="assembly-add-item-container" className="assembly-add-item-container">
        <label aria-label="add item" for="add-item" id="assembly-add-item-label" className="assembly-add-item-label">
          Add Item:&nbsp;
          <input
            title="item"
            value={inputStage}
            type="text"
            id="assembly-add-item"
            className="assembly-add-item"
            onChange={(event) => onChangeAssemblyItem(event.target.value)}
            onKeyPress={(event) => onCreateAssemblyItem(event)}
            placeholder="  add item"
          />
        </label>
      </div>
      <div id="assembly-stage-container" className="assembly-stage-container">
        {hasItemsToShow
          ? assemblyStages.map((stage) => (
            <BoardState
              className="assembly-stage"
              name={stage.name}
              children={stage.children}
              onMoveLeft={onMoveChildLeft}
              onMoveRight={onMoveChildRight}
            />
          ))
          : null}
      </div>
    </>
  );
};
export default BoardPipeline;
