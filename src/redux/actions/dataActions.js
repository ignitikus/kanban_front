export const loadData = (payload) => {
  return {
    type: "LOAD DATA",
  };
};

export const deleteTask = (payload) => {
  return {
    type: "DELETE TASK",
    payload,
  };
};
export const saveBoard = (payload) => {
  return {
    type: "SAVE BOARD",
    payload,
  };
};

export const changeTitle = (payload) => {
  return {
    type: "CHANGE TITLE",
    payload,
  };
};

export const resetData = (payload) => {
  return {
    type: "RESET DATA",
  };
};

export const dragStart = (payload) => {
  return {
    type: "ON DRAG START",
    payload,
  };
};

export const nullHomeIndex = (payload) => {
  return {
    type: "NULL HOME INDEX",
  };
};

export const rearrangeColumns = (payload) => {
  return {
    type: "REARRANGE COLUMNS",
    payload,
  };
};

export const rearrangeTasksSameColumn = (payload) => {
  return {
    type: "REARRANGE TASKS SAME COLUMN",
    payload,
  };
};

export const rearrangeTasksDifferentColumn = (payload) => {
  return {
    type: "REARRANGE TASKS DIFFERENT COLUMN",
    payload,
  };
};

export const addTask = (payload) => {
  return {
    type: "ADD TASK",
    payload,
  };
};

export const changeColumnName = (payload) => {
  return {
    type: "CHANGE COLUMN NAME",
    payload,
  };
};

export const editTaskBody = (payload) => {
  return {
    type: "EDIT TASK BODY",
    payload,
  };
};
