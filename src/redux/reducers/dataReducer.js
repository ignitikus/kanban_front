import { failureToast } from "../../Components/Toastify/Toast";

const initialState = {
  boardName: "KANBAN",
  homeIndex: null,
  tasks: {
    "task-1": { id: "task-1", content: "Take out the garbage" },
    "task-2": { id: "task-2", content: "Watch my favorite show" },
    "task-3": { id: "task-3", content: "Charge my phone" },
    "task-4": { id: "task-4", content: "Cook dinner" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TODO",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "column-2": {
      id: "column-2",
      title: "IN PROGRESS",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "DONE",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
  numOfTasks: 4,
  countOfTasks: 4,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case "LOAD DATA":
      const data = JSON.parse(localStorage.getItem("my-data"));
      if (data) {
        return { ...data };
      } else {
        return { ...state };
      }
    case "CHANGE TITLE":
      return { ...state, boardName: action.payload };
    case "SAVE BOARD":
      localStorage.setItem("my-data", JSON.stringify(state));
      return { ...state };
    case "RESET DATA":
      localStorage.removeItem("my-data");
      return {
        boardName: "KANBAN",
        homeIndex: null,
        tasks: {
          "task-1": { id: "task-1", content: "Take out the garbage" },
          "task-2": { id: "task-2", content: "Watch my favorite show" },
          "task-3": { id: "task-3", content: "Charge my phone" },
          "task-4": { id: "task-4", content: "Cook dinner" },
        },
        columns: {
          "column-1": {
            id: "column-1",
            title: "TODO",
            taskIds: ["task-1", "task-2", "task-3", "task-4"],
          },
          "column-2": {
            id: "column-2",
            title: "IN PROGRESS",
            taskIds: [],
          },
          "column-3": {
            id: "column-3",
            title: "DONE",
            taskIds: [],
          },
        },
        columnOrder: ["column-1", "column-2", "column-3"],
        numOfTasks: 4,
        countOfTasks: 4,
      };
    case "DELETE TASK":
      const copyColumn = { ...state.columns };
      const copyTasks = { ...state.tasks };

      const taskIndex = copyColumn[action.payload.columnId].taskIds.indexOf(
        action.payload.taskId
      );
      copyColumn[action.payload.columnId].taskIds.splice(taskIndex, 1);
      delete copyTasks[action.payload.taskId];

      return {
        ...state,
        columns: copyColumn,
        tasks: copyTasks,
        numOfTasks: state.numOfTasks - 1,
      };
    case "ON DRAG START":
      const homeIndex = state.columnOrder.indexOf(action.payload);
      return { ...state, homeIndex };
    case "NULL HOME INDEX":
      return { ...state, homeIndex: null };
    case "REARRANGE COLUMNS":
      const newColumnOrder = [...state.columnOrder];
      newColumnOrder.splice(action.payload.source.index, 1);
      newColumnOrder.splice(
        action.payload.destination.index,
        0,
        action.payload.draggableId
      );
      return { ...state, columnOrder: newColumnOrder };
    case "REARRANGE TASKS SAME COLUMN":
      const newTaskIds = [...action.payload.start.taskIds];
      newTaskIds.splice(action.payload.source.index, 1);
      newTaskIds.splice(
        action.payload.destination.index,
        0,
        action.payload.draggableId
      );
      const newColumn = {
        ...action.payload.start,
        taskIds: newTaskIds,
      };
      state.columns[newColumn.id] = newColumn;
      return { ...state };

    case "REARRANGE TASKS DIFFERENT COLUMN":
      const startTaskIds = [...action.payload.start.taskIds];
      console.log(startTaskIds);
      startTaskIds.splice(action.payload.source.index, 1);
      const newStart = {
        ...action.payload.start,
        taskIds: startTaskIds,
      };
      const finishTaskIds = [...action.payload.finish.taskIds];
      finishTaskIds.splice(
        action.payload.destination.index,
        0,
        action.payload.draggableId
      );
      const newFinish = {
        ...action.payload.finish,
        taskIds: finishTaskIds,
      };

      state.columns[newStart.id] = newStart;
      state.columns[newFinish.id] = newFinish;
      console.log(state);
      return { ...state };

    case "ADD TASK":
      if (state.numOfTasks < 10) {
        state.tasks[`task-${state.countOfTasks + 1}`] = {
          id: `task-${state.countOfTasks + 1}`,
          content: `New task number ${state.countOfTasks + 1}`,
        };
        state.columns["column-1"].taskIds.push(
          `task-${state.countOfTasks + 1}`
        );
        return {
          ...state,
          numOfTasks: state.numOfTasks + 1,
          countOfTasks: state.countOfTasks + 1,
        };
      } else {
        failureToast("Current limit is 10 tasks");
        return {
          ...state,
        };
      }

    case "CHANGE COLUMN NAME":
      const columnsCopy = { ...state.columns };
      columnsCopy[action.payload.id].title = action.payload.title;
      return { ...state, columns: columnsCopy };

    case "EDIT TASK BODY":
      console.log(action.payload);
      const copyTasks2 = { ...state.tasks };
      copyTasks2[action.payload.id].content = action.payload.taskBody;
      return { ...state, tasks: copyTasks2 };
    case "GENERIC REDUCER ACTION":
      if (action.payload) {
        console.log(action.payload);
      }
      return { ...state };
    default:
      return state;
  }
}
