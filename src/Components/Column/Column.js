import React, { useState } from "react";
import styled from "styled-components";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
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

const TitleInputWrapper = styled.div`
  display: flex;
  position: relative;
`;

const TitleInput = styled.input`
  padding: 10px;
  color: white;
  text-align: center;
  border: none;
  font-size: 1.3em;
  background-color: inherit;
  outline: none;
`;
const Edit = styled.div`
  position: absolute;
  right: 0px;
  opacity: 0;
  transition: opacity 0.5s ease;
`;

const Title = styled.div`
  padding: 10px;
  color: white;
  text-align: center;
  border: none;
  font-size: 1.3em;
  background-color: inherit;
  display: flex;
  position: relative;

  &:hover ${Edit} {
    opacity: 1;
  }
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease-in-out;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgb(66,133,244)" : "inherit"};
  flex-grow: 1;
  min-height: 100px;
  position: relative;
`;

const Done = styled.div`
  position: absolute;
  right: 0px;
  top: 10px;
  color: white;
  cursor: pointer;
`;

const AddButton = styled.div`
  color: white;
  font-size: 1.5em;
  position: absolute;
  right: -15px;
  bottom: -25px;
  cursor: pointer;
`;

function Column(props) {
  const [toggle, setToggle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(props.column.title);

  const handleEdit = () => {
    setToggle(true);
  };

  const handleDone = () => {
    setToggle(false);
    props.handleColumnTitleChange(props.column.id, columnTitle);
  };

  const handleFinish = (e) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
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
            <TitleInputWrapper>
              <TitleInput
                {...provided.dragHandleProps}
                value={columnTitle}
                onKeyDown={handleFinish}
                onChange={handleInputChange}
                autoFocus
              />
              <Done onClick={handleDone}>
                <DoneIcon />
              </Done>
            </TitleInputWrapper>
          ) : (
            <Title {...provided.dragHandleProps} onDoubleClick={handleEdit}>
              <div style={{ width: "100%" }}>{props.column.title}</div>

              <Edit onClick={handleEdit}>
                <EditIcon />
              </Edit>
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
                    editTask={props.editTask}
                  />
                ))}
                {provided.placeholder}
                {props.column.id === "column-1" && (
                  <AddButton onClick={props.addTask}>
                    <AddCircleOutlineIcon fontSize="large" />
                  </AddButton>
                )}
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
