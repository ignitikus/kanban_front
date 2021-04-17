import React, { useState } from "react";
import initialData from "./initial_data.js";
import Column from "./Components/Column/Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled, { keyframes } from "styled-components";
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
`;

const Title = styled.input`
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 2em;
  color: white;
  background-color: inherit;
  text-align: center;
  width: 100%;
`;

function App() {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState("KANBAN");
  const deleteTask = (taskId, columnId) => {
    console.log(taskId);
    console.log(columnId);
    const dataCopy = { ...data };
    const taskIndex = dataCopy.columns[columnId].taskIds.indexOf(taskId);
    dataCopy.columns[columnId].taskIds.splice(taskIndex, 1);

    setData(dataCopy);
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
    setTitle(e.target.value);
  };

  const handleColumnTitleChange = (id, name) => {
    const copyData = { ...data };
    copyData.columns[id].title = name;
    setData(copyData);
  };

  const addTask = () => {
    const copyData = { ...data };
    const numOfTasks = Object.keys(copyData.tasks).length;
    if (numOfTasks < 10) {
      copyData.tasks[`task-${numOfTasks + 1}`] = {
        id: `task-${numOfTasks + 1}`,
        content: `New task number ${numOfTasks + 1}`,
      };
      copyData.columns["column-1"].taskIds.push(`task-${numOfTasks + 1}`);
      setData(copyData);
    }
  };

  return (
    <Outer>
      <div>
        <Title value={title} onChange={handleTitleChange} />
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
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
