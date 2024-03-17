import { Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import ReactHtmlParser from "react-html-parser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import Loading from "../molecules/Loading";

import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";

interface AboutProps {
  edit: boolean;
}

type modalBodyProps = {
  handleModal: () => void;
  handleConfirmClose: () => void;
};

const ModalBody = ({ handleModal, handleConfirmClose }: modalBodyProps) => {
  return (
    <div>
      <p className="text-center text-2xl font-bold">Publish text changes?</p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button
            className="border-solid border-2 border-black font-semibold"
            variety="secondary"
            onClick={handleConfirmClose}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button className="font-semibold" onClick={handleModal}>
            Yes, publish
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

type aboutPageData = {
  pageid: string;
  content: string
};

/**
 * An About component
 */
const About = ({ edit }: AboutProps) => {

  /** Tanstack query for fetching the about page data */
  const {
    data: aboutPageDetailsQuery,
    isPending: aboutPageFetchPending,
    isError,
  } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const { response, data } = await api.get("/about");
      // console.log(data);
      setValue(data.content);
      return data;
    },
  });

  let {
    pageid,
    content,
  }: aboutPageData = {
    pageid: aboutPageDetailsQuery?.id,
    content: aboutPageDetailsQuery?.content,
  };

  const queryClient = useQueryClient();

  /** Tanstack query mutation for changing the about page content */
  const { mutateAsync: changeAboutContent } = useMutation({
    mutationFn: async (variables: { newContent: string }) => {
      const { newContent } = variables;
      const { data } = await api.patch(`/${pageid}/about`, {
        newContent: newContent,
      });
      return data;
    },
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const [value, setValue] = useState(content);
  // console.log(`value: ${value}`);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const lastValueRef = useRef(value);
  const handleConfirmOpen = () => setOpenConfirm(true);
  const handleConfirmClose = () => setOpenConfirm(false);
  const handleEditOpen = () => setEditMode(true);
  const handleEditClose = () => {
    setEditMode(false);
    setValue(lastValueRef.current);
  };
  const handleModalClick = () => {
    setEditMode(false);
    handleConfirmClose();
    lastValueRef.current = value;
    changeAboutContent({ newContent: value });
  };

  if (aboutPageFetchPending) {
    return <Loading />;
  }

  if (editMode == true) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="col-start-1 col-span-1 sm:col-start-1 sm:col-span-1">
            <Button
              className="bg-white font-semibold"
              variety="secondary"
              icon={<UploadIcon />}
            >
              Upload Image
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-2 sm:col-span-1">
            <Button
              className="bg-white font-semibold"
              variety="secondary"
              onClick={handleEditClose}
              icon={<EditIcon />}
            >
              Edit Text
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-5 sm:col-span-1">
            <Button
              className="border-solid border-2 border-[#CB2F2F] font-semibold text-[#CB2F2F]"
              variety="secondary"
              onClick={handleEditClose}
            >
              Cancel
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-6 sm:col-span-1">
            <Button
              className="font-semibold"
              variety="primary"
              onClick={handleConfirmOpen}
            >
              Publish Changes
            </Button>
          </div>
        </div>
        <h2></h2>
        <div className="space-y-2">
          <Modal
            open={openConfirm}
            handleClose={handleConfirmClose}
            children={
              <ModalBody
                handleModal={handleModalClick}
                handleConfirmClose={handleConfirmClose}
              />
            }
          />
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          readOnly={false}
        />
        <br></br>
      </>
    );
  } else {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="col-start-1 col-span-1 sm:col-start-1 sm:col-span-1">
            <Button
              className="bg-white font-semibold"
              variety="secondary"
              icon={<UploadIcon />}
            >
              Upload Image
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-2 sm:col-span-1">
            <Button
              className="bg-white font-semibold"
              variety="secondary"
              onClick={handleEditOpen}
              icon={<EditIcon />}
            >
              Edit Text
            </Button>
          </div>
        </div>

        <div>{ReactHtmlParser(value)}</div>
      </div>
    );
  }
};

export default About;
