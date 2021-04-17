import React, { useState, useEffect } from "react";
import initialData from "./initial_data.js";
import Column from "./Components/Column/Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled, { keyframes } from "styled-components";
import { isMobile } from "react-device-detect";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import "./App.css";

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

const Title = styled.div`
  font-weight: 500;
  font-size: 2em;
  color: white;
  background-color: inherit;
  text-align: center;
  width: 100%;
  cursor: default;
`;

const Done = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  cursor: pointer;
`;

function App() {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState("KANBAN");
  const [count, setCount] = useState(0);
  const [numOfTasks, setNumOfTasks] = useState(0);
  const [editTitle, setEditTitle] = useState(false);

  const deleteTask = (taskId, columnId) => {
    const dataCopy = { ...data };
    const taskIndex = dataCopy.columns[columnId].taskIds.indexOf(taskId);
    dataCopy.columns[columnId].taskIds.splice(taskIndex, 1);
    delete dataCopy.tasks[taskId];
    setData(dataCopy);
    setNumOfTasks(numOfTasks - 1);
  };

  const onDragStart = (start) => {
    const homeIndex = data.columnOrder.indexOf(start.source.droppableId);
    const copyData = { ...data };
    copyData.homeIndex = homeIndex;
    setData(copyData);
  };

  const onDragEnd = (res) => {
    const copyData = { ...data };
    copyData.homeIndex = null;
    setData(copyData);

    const { destination, source, draggableId, type } = res;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "column") {
      const newColumnOrder = [...data.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const updatedStateData = {
        ...data,
      };

      updatedStateData.columnOrder = newColumnOrder;
      setData(updatedStateData);
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
      };
      newData.columns[newColumn.id] = newColumn;

      setData(newData);
      return;
    }
    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1);

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const updatedData = {
      ...data,
    };
    updatedData.columns[newStart.id] = newStart;
    updatedData.columns[newFinish.id] = newFinish;

    setData(updatedData);
  };

  const handleTitleChange = (e) => {
    console.log(e);
    if (title.length < 25) {
      setTitle(e.target.value);
    } else {
    }
  };

  const handleFinish = (e) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      setEditTitle(false);
      setTitle(e.target.value);
    }
  };

  const handleColumnTitleChange = (id, name) => {
    const copyData = { ...data };
    copyData.columns[id].title = name;
    setData(copyData);
  };

  const addTask = () => {
    const copyData = { ...data };
    if (numOfTasks < 10) {
      copyData.tasks[`task-${count}`] = {
        id: `task-${count}`,
        content: `New task number ${count}`,
      };
      copyData.columns["column-1"].taskIds.push(`task-${count}`);
      setData(copyData);
      setCount(count + 1);
      setNumOfTasks(numOfTasks + 1);
    }
  };

  const editTask = (id, content) => {
    const copyData = { ...data };
    copyData.tasks[id].content = content;

    setData(copyData);
  };

  const handleDone = () => {
    setEditTitle(false);
  };

  useEffect(() => {
    setCount(Object.keys(data.tasks).length + 1);
    setNumOfTasks(Object.keys(data.tasks).length);
    // eslint-disable-next-line
  }, []);

  return (
    <Outer>
      <div>
        <div>
          {editTitle ? (
            <TitleContainer>
              <TitleInput
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleFinish}
                autoFocus
              />
              <Done onClick={handleDone}>
                <DoneIcon />
              </Done>
            </TitleContainer>
          ) : (
            <Title onDoubleClick={() => setEditTitle(true)}>
              <EditIcon style={{ opacity: "0" }} />
              &nbsp;
              {title}
              &nbsp;
              <EditIcon
                style={{ cursor: "pointer" }}
                onClick={() => setEditTitle(true)}
              />
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
                {data.columnOrder.map((columnId, index) => {
                  const column = data.columns[columnId];
                  const tasks = column.taskIds.map(
                    (taskId) => data.tasks[taskId]
                  );
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      index={index}
                      deleteTask={deleteTask}
                      handleColumnTitleChange={handleColumnTitleChange}
                      addTask={addTask}
                      editTask={editTask}
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
