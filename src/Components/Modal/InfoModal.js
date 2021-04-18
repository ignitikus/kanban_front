import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import styled, { keyframes } from "styled-components";
import { isMobile } from "react-device-detect";

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

const ModalBody = styled.div`
  background: linear-gradient(
    -45deg,
    rgb(97, 67, 133),
    rgb(81, 99, 149),
    rgb(81, 127, 149),
    rgb(81, 149, 129)
  );
  background-size: 400% 400%;
  animation: ${gradient} 5s ease infinite;
  color: white;

  display: flex;
  flex-direction: column;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  outline: none;
  padding-top: 30px;
  width: 70%;
  height: 70%;
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 2em;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:active {
    transform: scale(0.6);
  }
`;

const UnorderedList = styled.ul`
  list-style: none;

  & li {
    padding: 3px;
  }
`;

const Anchor = styled.a`
  color: white;
  padding: 3px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.div`
  padding: 5px;
`;

export default function InfoModal(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.showModal(false);
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
            <CloseButton onClick={handleClose}>x</CloseButton>
            {isMobile ? (
              <h5>THANKS FOR CHECKING OUT MY PROJECT!</h5>
            ) : (
              <h3>THANKS FOR CHECKING OUT MY PROJECT!</h3>
            )}
            <Description>
              <Anchor
                href="https://github.com/ignitikus/kanban_front"
                target="_blank"
                rel="noreferrer"
              >
                Link to repo for this project
              </Anchor>
            </Description>
            <Description>
              Tech used here:
              <UnorderedList>
                <li>
                  <Anchor
                    href="https://reactjs.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ReactJs
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://react-redux.js.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    React Redux
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://www.npmjs.com/package/react-beautiful-dnd"
                    target="_blank"
                    rel="noreferrer"
                  >
                    React-beautiful-dnd
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://www.npmjs.com/package/react-toastify"
                    target="_blank"
                    rel="noreferrer"
                  >
                    React-Toastifty
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://styled-components.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Styled-components
                  </Anchor>
                </li>
              </UnorderedList>
            </Description>
            <Description>
              Contact info:
              <UnorderedList>
                <li>
                  <Anchor href="mailto:nikgnis@gmail.com">Send mail</Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://github.com/ignitikus"
                    target="_blank"
                    rel="noreferrer"
                  >
                    My GitHub
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://www.linkedin.com/in/nikolay-kim-392234aa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Connect on LinkedIn
                  </Anchor>
                </li>
              </UnorderedList>
            </Description>
          </ModalBody>
        </Fade>
      </Modal>
    </div>
  );
}
