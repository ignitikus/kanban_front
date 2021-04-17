import React, { useState } from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";

import Task from "../Task/Task";

const Container = styled.div`
  margin: 8px;
  border: 1px dotted lightgrey;
  transition: background-color 1.5s ease-in-out;
  background-color: ${(props) =>
    props.isDragging ? "rgb(66,133,244)" : "inherit"};
  border-radius: 6px;
  width: 220px;
  user-select: none;
  display: flex;
  flex-direction: column;
`;
const TitleInput = styled.input`
  padding: 10px;
  color: white;
  text-align: center;
  border: none;
  font-size: 1.3em;
  background-color: inherit;
`;
const Title = styled.div`
  padding: 10px;
  color: white;
  text-align: center;
  border: none;
  font-size: 1.3em;
  background-color: inherit;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease-in-out;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgb(66,133,244)" : "inherit"};
  flex-grow: 1;
  min-height: 100px;
`;

function Column(props) {
  const [toggle, setToggle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(props.column.title);

  const handleDoubleClick = () => {
    setToggle(true);
  };

  const handleFinish = (e) => {
    if (e.keyCode === 13) {
      setToggle(false);
      props.handleColumnTitleChange(props.column.id, columnTitle);
    }
  };

  const handleInputChange = (e) => {
    setColumnTitle(e.target.value);
  };

  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {toggle ? (
            <TitleInput
              {...provided.dragHandleProps}
              value={columnTitle}
              onKeyDown={handleFinish}
              onChange={handleInputChange}
            />
          ) : (
            <Title
              {...provided.dragHandleProps}
              onDoubleClick={handleDoubleClick}
            >
              {props.column.title}
            </Title>
          )}

          <Droppable
            droppableId={props.column.id}
            isDropDisabled={props.isDropDisabled}
            type="task"
          >
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {props.tasks.map((task, ind) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={ind}
                    deleteTask={props.deleteTask}
                    columnName={props.column.id}
                  />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default React.memo(Column, (props, nextProps) => {
  if (props.prop1 === nextProps.prop1) {
    return false;
  }
  return true;
});
