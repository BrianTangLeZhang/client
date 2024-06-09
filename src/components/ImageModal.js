import { Modal, Box } from "@mui/material";

export default function ImageModal(props) {
  const { imageSRC, modalOpen, setModalOpen } = props;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 1000,
    display: "flex",
    alignItems: "center",
    bgcolor: "black",
    border: "none",
    boxShadow: 50,
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <Box sx={style}>
        <img
          src={imageSRC}
          alt={imageSRC}
          style={{ width: "100%", objectFit: "contain" }}
        />
      </Box>
    </Modal>
  );
}
