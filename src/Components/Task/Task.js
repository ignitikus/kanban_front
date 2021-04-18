import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import DoneIcon from "@material-ui/icons/Done";
import TransitionsModal from "../Modal/Modal";

import { deleteTask, editTaskBody } from "../../redux/actions/dataActions";

import { useDispatch } from "react-redux";

const appear = keyframes`
   0%{
      opacity: .7;
   }
   100%{
      opacity: 1;
   }
`;

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
  display: flex;
  animation: ${appear} 1s ease-in;
  &:hover ${CloseButton} {
    opacity: 1;
  }
`;

const TaskBody = styled.div`
  display: flex;
  width: 100%;
`;

const CheckBox = styled.input``;

const TaskInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;

export default function Task(props) {
  const [block, setBlock] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [taskBody, setTaskBody] = useState(props.task.content);
  const dispatch = useDispatch();

  const handleCheckBox = () => {
    setBlock(!block);
  };

  const handleTaskEdit = (e) => {
    setTaskBody(e.target.value);
  };

  const handleEditDone = () => {
    setEdit(false);
    dispatch(editTaskBody({ id: props.task.id, taskBody }));
  };

  const handleFinish = (e) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      handleEditDone();
    }
  };

  const handleEdit = () => {
    if (props.isMobile) {
      setOpenModal(true);
    } else {
      setEdit(true);
    }
  };

  const handleDeleteTask = () => {
    dispatch(
      deleteTask({
        taskId: props.task.id,
        columnId: props.columnName,
      })
    );
  };

  return (
    <>
      <TransitionsModal
        open={openModal}
        showModal={setOpenModal}
        inputValue={props.task.content}
        id={props.task.id}
        mode={"task"}
        setTaskBody={setTaskBody}
      />
      <Draggable
        draggableId={props.id}
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
            {!edit ? (
              <TaskBody onDoubleClick={handleEdit}>
                <CheckBox
                  type="checkbox"
                  checked={block}
                  onChange={handleCheckBox}
                />
                {taskBody}
                {!block && (
                  <CloseButton onClick={handleDeleteTask}>x</CloseButton>
                )}
              </TaskBody>
            ) : (
              <>
                <TaskInput
                  value={taskBody}
                  onChange={handleTaskEdit}
                  autoFocus
                  onKeyDown={handleFinish}
                />
                <DoneIcon
                  onClick={handleEditDone}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
          </Container>
        )}
      </Draggable>
    </>
  );
}
