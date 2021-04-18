import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import {
  changeTitle,
  changeColumnName,
  editTaskBody,
} from "../../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  position: absolute;
  top: 0;
  border-radius: 0 0 15px 15px;
  outline: none;
  padding-top: 30px;
  width: 90%;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0 20px 0;
`;

const Button = styled.button``;
const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  text-align: center;
  font-size: 1.3em;
`;

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [inputVal, setInputVal] = useState(props.inputValue);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (props.setTaskBody) {
      props.setTaskBody(inputVal);
    }
    props.showModal(false);
  };

  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  };

  const handleSubmit = () => {
    switch (props.mode) {
      case "title":
        dispatch(changeTitle(inputVal));
        setInputVal("");
        handleClose();
        break;
      case "column":
        dispatch(changeColumnName({ id: props.id, title: inputVal }));
        setInputVal("");
        handleClose();
        break;
      case "task":
        dispatch(editTaskBody({ id: props.id, taskBody: inputVal }));
        setInputVal("");
        handleClose();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <ModalBody>
            <Input
              value={inputVal}
              onChange={handleOnChange}
              autoFocus
              maxLength="30"
            ></Input>
            <ButtonContainer>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </ButtonContainer>
          </ModalBody>
        </Fade>
      </Modal>
    </div>
  );
}
