import React, { useState, useEffect } from "react";
import Column from "./Components/Column/Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled, { keyframes } from "styled-components";
import { isMobile } from "react-device-detect";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import SaveIcon from "@material-ui/icons/Save";
import ReplayIcon from "@material-ui/icons/Replay";
import HelpIcon from "@material-ui/icons/Help";
import TransitionsModal from "./Components/Modal/Modal";
import InfoModal from "./Components/Modal/InfoModal";
import Toastify from "./Components/Toastify/Toastify";
import { failureToast, successToast } from "./Components/Toastify/Toast";

import { useDispatch, useSelector } from "react-redux";

import {
  loadData,
  resetData,
  saveBoard,
  changeTitle,
  dragStart,
  nullHomeIndex,
  rearrangeColumns,
  rearrangeTasksSameColumn,
  rearrangeTasksDifferentColumn,
} from "./redux/actions/dataActions";
import "./App.css";

const vibrate = keyframes`
 0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
`;

const gradient = keyframes`
  0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-359deg);
  }
}
`;

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;

  background: linear-gradient(45deg, #ee7752, #e73c5e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradient} 20s ease infinite;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  color: white;
  position: relative;
`;

const TitleInput = styled.input`
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 2em;
  color: white;
  background-color: inherit;
  text-align: center;
  width: 100%;
`;

const EditButtonContainer = styled.div`
  opacity: 0;
  transition: opacity 0.5s ease;
`;
const Title = styled.div`
  font-weight: 500;
  font-size: 2em;
  color: white;
  background-color: inherit;
  text-align: center;
  width: 100%;
  cursor: default;
  display: flex;
  justify-content: center;

  &:hover ${EditButtonContainer} {
    opacity: 1;
  }
`;

const Done = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  cursor: pointer;
`;

const SaveIconContainer = styled.div`
  cursor: pointer;

  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.7);
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ResetIconContainer = styled.div`
  cursor: pointer;

  transition: transform 0.3s ease;

  &:hover {
    animation: ${rotation} 2s infinite;
  }
`;

const HelpIconContainer = styled.div`
  cursor: pointer;

  transition: transform 0.3s ease;

  &:hover {
    animation: ${vibrate} 0.5s infinite;
  }
`;

function App() {
  const { boardName, columnOrder, columns, tasks } = useSelector(
    (state) => state.data
  );
  const dispatch = useDispatch();

  const [title, setTitle] = useState(boardName);

  const [editTitle, setEditTitle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);

  const onDragStart = (start) => {
    dispatch(dragStart(start.source.droppableId));
  };

  const onDragEnd = (res) => {
    dispatch(nullHomeIndex());
    const { destination, source, draggableId, type } = res;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    if (type === "column") {
      dispatch(rearrangeColumns({ destination, source, draggableId }));
      return;
    }
    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      dispatch(
        rearrangeTasksSameColumn({ destination, source, draggableId, start })
      );
      return;
    }

    dispatch(
      rearrangeTasksDifferentColumn({
        destination,
        source,
        draggableId,
        start,
        finish,
      })
    );
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDone = () => {
    setEditTitle(false);
    dispatch(changeTitle(title));
  };

  const handleFinish = (e) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      handleDone();
    }
  };

  const handleTitleDoubleClick = () => {
    if (isMobile) {
      setOpenModal(true);
    } else {
      setEditTitle(true);
    }
  };

  const handleSave = () => {
    try {
      dispatch(saveBoard({ boardName: title }));
      successToast(
        `Board: "${title}" is saved to local storage of your browser`
      );
    } catch (error) {
      failureToast(error.message);
    }
  };

  const handleReset = () => {
    try {
      dispatch(resetData());
      successToast(`Everything is reset to default`);
    } catch (error) {
      failureToast(error.message);
    }
  };

  const handleOpenInfoModal = () => {
    setOpenInfoModal(true);
  };

  useEffect(() => {
    dispatch(loadData());
    // eslint-disable-next-line
  }, []);

  return (
    <Outer>
      <Toastify />
      <InfoModal open={openInfoModal} showModal={setOpenInfoModal} />
      <TransitionsModal
        open={openModal}
        showModal={setOpenModal}
        inputValue={title}
        mode={"title"}
      />
      <ButtonsContainer>
        <SaveIconContainer onClick={handleSave}>
          <SaveIcon fontSize={isMobile ? "default" : "large"} />
        </SaveIconContainer>
        <ResetIconContainer onClick={handleReset}>
          <ReplayIcon fontSize={isMobile ? "default" : "large"} />
        </ResetIconContainer>
        <HelpIconContainer onClick={handleOpenInfoModal}>
          <HelpIcon fontSize={isMobile ? "default" : "large"} />
        </HelpIconContainer>
      </ButtonsContainer>
      <div>
        <div>
          {editTitle ? (
            <TitleContainer>
              <TitleInput
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleFinish}
                maxLength="20"
                autoFocus
              />
              <Done onClick={handleDone}>
                <DoneIcon />
              </Done>
            </TitleContainer>
          ) : (
            <Title onDoubleClick={handleTitleDoubleClick}>
              <EditIcon style={{ opacity: "0" }} />
              &nbsp;
              {boardName}
              &nbsp;
              <EditButtonContainer onClick={handleTitleDoubleClick}>
                <EditIcon style={{ cursor: "pointer" }} />
              </EditButtonContainer>
            </Title>
          )}
        </div>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable
            droppableId="all-columns"
            direction={isMobile ? "vertical" : "horizontal"}
            type="column"
          >
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {columnOrder.map((columnId, index) => {
                  const column = columns[columnId];
                  const columnTasks = column.taskIds.map(
                    (taskId) => tasks[taskId]
                  );
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={columnTasks}
                      index={index}
                      isMobile={isMobile}
                    />
                  );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Outer>
  );
}

export default App;
