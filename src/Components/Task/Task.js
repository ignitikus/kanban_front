import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const shake = keyframes`
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 0px;
  right: 5px;
  opacity: 0;
  transition: opacity 0.5s ease;
  animation: ${shake} 1s linear infinite;
  font-size: 1.3em;

  &:hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) =>
    props.isDragDisabled
      ? "lightgrey "
      : props.isDragging
      ? "lightgreen"
      : "white"};
  position: relative;
  /* width: 40px;
  height: 40px; */
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  &:hover ${CloseButton} {
    opacity: 1;
  }
`;

const CheckBox = styled.input``;

export default function Task(props) {
  const [block, setBlock] = useState(false);

  const handleCheckBox = () => {
    setBlock(!block);
  };

  return (
    <Draggable
      draggableId={props.task.id}
      index={props.index}
      isDragDisabled={block}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={block}
        >
          <CheckBox type="checkbox" checked={block} onChange={handleCheckBox} />
          {props.task.content}
          {!block && (
            <CloseButton
              onClick={() => props.deleteTask(props.task.id, props.columnName)}
            >
              x
            </CloseButton>
          )}
        </Container>
      )}
    </Draggable>
  );
}
